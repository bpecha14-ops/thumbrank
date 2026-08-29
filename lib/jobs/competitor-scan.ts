import { createClient } from '@/lib/supabase/server'
import { fetchChannelVideos } from '@/lib/youtube/rss'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function runCompetitorScan() {
  console.log('SCAN: starting')
  const supabase = createClient()
  
  const { data: competitors, error } = await supabase.from('competitors').select('*')
  console.log('SCAN: competitors count =', competitors?.length, 'error =', error?.message)
  if (error) throw error
  if (!competitors || competitors.length === 0) {
    return { ok: true, job: 'competitor-scan', scanned: 0, newVideos: 0 }
  }

  const allNewVideos: Array<{
    competitorId: string
    videoId: string
    title: string
    publishedAt: string
    thumbnailUrl: string
  }> = []

  for (const competitor of competitors) {
    console.log('SCAN: processing competitor', competitor.channel_id)
    try {
      const rssVideos = await fetchChannelVideos(competitor.channel_id)
      console.log('SCAN: RSS returned', rssVideos.length, 'videos')
      
      const { data: existing } = await supabase
        .from('competitor_videos')
        .select('video_id')
        .eq('competitor_id', competitor.id)
      
      const existingIds = new Set(existing?.map(v => v.video_id) || [])
      const newVideos = rssVideos.filter(v => !existingIds.has(v.videoId))
      console.log('SCAN: new videos for this competitor =', newVideos.length)
      
      for (const v of newVideos) {
        allNewVideos.push({
          competitorId: competitor.id,
          videoId: v.videoId,
          title: v.title,
          publishedAt: v.publishedAt,
          thumbnailUrl: v.thumbnailUrl,
        })
      }
    } catch (err: any) {
      console.error('SCAN: RSS error for', competitor.channel_id, err.message)
      continue
    }
  }

  if (allNewVideos.length === 0) {
    return { ok: true, job: 'competitor-scan', scanned: competitors.length, newVideos: 0 }
  }

  console.log('SCAN: total new videos =', allNewVideos.length)

  const viewCounts: Record<string, number> = {}
  const videoIdList = allNewVideos.map(v => v.videoId)
  
  try {
    for (let i = 0; i < videoIdList.length; i += 50) {
      const batch = videoIdList.slice(i, i + 50)
      console.log('SCAN: fetching view counts for batch', i, 'size', batch.length)
      const batchCounts = await fetchViewCounts(batch)
      Object.assign(viewCounts, batchCounts)
    }
  } catch (err: any) {
    console.error('SCAN: YouTube API error', err.message)
  }

  const byCompetitor = new Map<string, typeof allNewVideos>()
  for (const v of allNewVideos) {
    if (!byCompetitor.has(v.competitorId)) byCompetitor.set(v.competitorId, [])
    byCompetitor.get(v.competitorId)!.push(v)
  }

  let totalNew = 0
  let aiBreakdownCount = 0

  for (const [competitorId, videos] of byCompetitor) {
    const competitor = competitors.find(c => c.id === competitorId)
    if (!competitor) continue

    try {
      const { data: history } = await supabase
        .from('competitor_videos')
        .select('view_count')
        .eq('competitor_id', competitorId)
        .order('created_at', { ascending: false })
        .limit(10)

      const historyViews = (history?.map(v => v.view_count) || []).filter((v): v is number => v > 0)
      const newViews = videos.map(v => viewCounts[v.videoId] || 0).filter(v => v > 0)
      const avgViews = median([...historyViews, ...newViews])

      for (const v of videos) {
        const viewCount = viewCounts[v.videoId] || 0
        const outlierMultiplier = avgViews > 0 ? viewCount / avgViews : null

        await supabase.from('competitor_videos').insert({
          competitor_id: competitorId,
          video_id: v.videoId,
          title: v.title,
          thumbnail_url: v.thumbnailUrl,
          published_at: v.publishedAt,
          view_count: viewCount,
          outlier_multiplier: outlierMultiplier,
        })
        totalNew++

        if (outlierMultiplier && outlierMultiplier >= 1.5 && aiBreakdownCount < 5) {
          try {
            const breakdown = await analyzeThumbnail(v.thumbnailUrl, v.title)
            await supabase
              .from('competitor_videos')
              .update({ ai_breakdown: breakdown })
              .eq('video_id', v.videoId)
              .eq('competitor_id', competitorId)
            aiBreakdownCount++
          } catch (err) {
            console.error('AI breakdown failed:', err)
          }
        }
      }

      await supabase
        .from('competitors')
        .update({ avg_views: Math.round(avgViews) })
        .eq('id', competitorId)
    } catch (err: any) {
      console.error('SCAN: DB error for competitor', competitorId, err.message)
    }
  }

  return { ok: true, job: 'competitor-scan', scanned: competitors.length, newVideos: totalNew, aiBreakdowns: aiBreakdownCount }
}

async function fetchViewCounts(videoIds: string[]): Promise<Record<string, number>> {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) {
    console.log('SCAN: no YOUTUBE_API_KEY or empty batch')
    return {}
  }
  const ids = videoIds.join(',')
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${YOUTUBE_API_KEY}`
  console.log('SCAN: YouTube API URL =', url.replace(YOUTUBE_API_KEY, '***'))
  const res = await fetch(url, { headers: { 'User-Agent': 'ThumbRank/1.0' } })
  if (!res.ok) {
    const text = await res.text()
    console.error('SCAN: YouTube API error status', res.status, text)
    return {}
  }
  const data = await res.json()
  const result: Record<string, number> = {}
  for (const item of data.items || []) {
    result[item.id] = parseInt(item.statistics?.viewCount || '0', 10)
  }
  return result
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

function median(arr: number[]): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
