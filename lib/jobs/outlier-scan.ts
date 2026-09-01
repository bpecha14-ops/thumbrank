import { createClient } from '@/lib/supabase/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const NICHE_LIST = ['gaming', 'tech', 'cooking', 'fitness', 'finance', 'vlog']

export async function runOutlierScan() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  let totalSaved = 0
  let aiCount = 0

  for (const niche of NICHE_LIST) {
    try {
      // 1. Search videos by niche (last 7 days, order by viewCount)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
     const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&publishedAfter=${weekAgo}&q=${encodeURIComponent(niche)}&maxResults=10&key=${YOUTUBE_API_KEY}&relevanceLanguage=en&regionCode=US`
      const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'ThumbRank/1.0' } })
      if (!searchRes.ok) {
        console.error('OUTLIER: search error', niche, searchRes.status)
        continue
      }
      const searchData = await searchRes.json()
      const items = searchData.items || []
      if (items.length === 0) continue

      // 2. Batch get video statistics
      const videoIds = items.map((i: any) => i.id.videoId).filter(Boolean)
      const videoMap: Record<string, any> = {}
      for (let i = 0; i < videoIds.length; i += 50) {
        const batch = videoIds.slice(i, i + 50)
        const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${batch.join(',')}&key=${YOUTUBE_API_KEY}`
        const vRes = await fetch(vUrl, { headers: { 'User-Agent': 'ThumbRank/1.0' } })
        if (!vRes.ok) continue
        const vData = await vRes.json()
        for (const v of vData.items || []) {
          videoMap[v.id] = v.statistics
        }
      }

      // 3. Batch get channel statistics (for subscriber count as baseline)
      const channelIds = [...new Set(items.map((i: any) => i.snippet?.channelId).filter(Boolean))]
      const channelMap: Record<string, any> = {}
      for (let i = 0; i < channelIds.length; i += 50) {
        const batch = channelIds.slice(i, i + 50)
        const cUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${batch.join(',')}&key=${YOUTUBE_API_KEY}`
        const cRes = await fetch(cUrl, { headers: { 'User-Agent': 'ThumbRank/1.0' } })
        if (!cRes.ok) continue
        const cData = await cRes.json()
        for (const c of cData.items || []) {
          channelMap[c.id] = c.statistics
        }
      }

      // 4. Calculate outlier multiplier
      const outliers: any[] = []
      for (const item of items) {
        const vid = item.id.videoId
        const stats = videoMap[vid]
        if (!stats) continue
        const views = parseInt(stats.viewCount || '0', 10)
        const channelId = item.snippet?.channelId
        const channelStats = channelMap[channelId]
        const subs = parseInt(channelStats?.subscriberCount || '0', 10)
        const baseline = subs > 0 ? subs : 1000 // fallback
        const multiplier = views / baseline

        if (multiplier >= 3) {
          outliers.push({
            niche,
            video_id: vid,
            channel_id: channelId,
            title: item.snippet?.title || '',
            thumbnail_url: item.snippet?.thumbnails?.medium?.url || '',
            view_count: views,
            channel_avg_views: baseline,
            outlier_multiplier: multiplier,
          })
        }
      }

      // Sort by multiplier desc, take top 5
      outliers.sort((a, b) => b.outlier_multiplier - a.outlier_multiplier)
      const top5 = outliers.slice(0, 5)

      // 5. Save to DB (skip duplicates via unique constraint)
      for (const o of top5) {
        const { error } = await supabase.from('niche_outliers').insert({
          niche: o.niche,
          video_id: o.video_id,
          channel_id: o.channel_id,
          title: o.title,
          thumbnail_url: o.thumbnail_url,
          view_count: o.view_count,
          channel_avg_views: o.channel_avg_views,
          outlier_multiplier: o.outlier_multiplier,
          fetched_date: today,
        })
        if (!error) totalSaved++
      }

      // 6. AI breakdown for top 3 (limit 3 per niche per day)
      const top3 = top5.slice(0, 3)
      for (const o of top3) {
        if (aiCount >= 3) break // global limit per run
        try {
          const breakdown = await analyzeThumbnail(o.thumbnail_url, o.title)
          await supabase
            .from('niche_outliers')
            .update({ ai_breakdown: breakdown })
            .eq('video_id', o.video_id)
            .eq('niche', o.niche)
            .eq('fetched_date', today)
          aiCount++
        } catch (err) {
          console.error('OUTLIER: AI error', err)
        }
      }
    } catch (err: any) {
      console.error('OUTLIER: niche error', niche, err.message)
    }
  }

  return { ok: true, job: 'outlier-scan', saved: totalSaved, aiBreakdowns: aiCount }
}

async function analyzeThumbnail(thumbnailUrl: string, title: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'You are a YouTube packaging expert. Analyze this thumbnail: why it works (or doesn\'t). Give: 1) hook type, 2) visual strengths, 3) ONE weakness a competitor could exploit. Max 80 words.' },
          { type: 'image_url', image_url: { url: thumbnailUrl } },
        ],
      }],
      max_tokens: 150,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'No analysis available.'
}
