export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'

export default async function DigestPage() {
  const supabase = createClient()

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: videos } = await supabase
    .from('competitor_videos')
    .select('*, competitors(channel_title, channel_avatar)')
    .gte('created_at', yesterday)
    .order('outlier_multiplier', { ascending: false })
    .limit(20)

  if (!videos || videos.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No new videos today</h1>
          <p className="text-gray-400">Your competitors haven't uploaded anything in the last 24 hours.</p>
          <a href="/" className="mt-6 inline-block px-6 py-3 bg-white text-black rounded-lg">Back to ThumbRank</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🌅 Morning Briefing</h1>
        <p className="text-gray-400 mb-8">{videos.length} new video{videos.length > 1 ? 's' : ''} from your competitors</p>

        <div className="grid gap-6">
          {videos.map((video: any) => (
            <div key={video.id} className="border border-gray-800 rounded-xl p-4 flex gap-4 hover:border-gray-600 transition">
              <img src={video.thumbnail_url} alt={video.title} className="w-48 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-400">{video.competitors?.channel_title || 'Unknown'}</span>
                  {video.outlier_multiplier && video.outlier_multiplier >= 1.5 && (
                    <span className="bg-green-600 text-xs px-2 py-1 rounded-full">{video.outlier_multiplier.toFixed(1)}x outlier</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                {video.ai_breakdown && (
                  <p className="text-sm text-gray-400 mb-3">{video.ai_breakdown}</p>
                )}
                <div className="flex gap-3">
                  <a href={`https://youtube.com/watch?v=${video.video_id}`} target="_blank" className="text-sm text-blue-400 hover:underline">Watch on YouTube</a>
                  <a href={`/tool?ref=${video.video_id}`} className="text-sm text-white hover:underline">Analyze in ThumbRank</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
