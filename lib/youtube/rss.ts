import { XMLParser } from 'fast-xml-parser'

export interface RssVideo {
  videoId: string
  title: string
  publishedAt: string
  thumbnailUrl: string
}

export async function fetchChannelVideos(channelId: string): Promise<RssVideo[]> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const res = await fetch(rssUrl, {
    headers: { 'User-Agent': 'ThumbRank/1.0' },
  })
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  const xml = await res.text()
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  })
  const parsed = parser.parse(xml)
  
  const entries = parsed.feed?.entry || []
  const videos: RssVideo[] = []
  
  for (const entry of Array.isArray(entries) ? entries : [entries]) {
    const videoId = entry['yt:videoId']
    if (!videoId) continue
    videos.push({
      videoId,
      title: entry.title || '',
      publishedAt: entry.published || '',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    })
  }
  
  return videos
}
