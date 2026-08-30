export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'

export default async function InspirePage() {
  const supabase = createClient()

  const { data: videos } = await supabase
    .from('niche_outliers')
    .select('*')
    .order('outlier_multiplier', { ascending: false })
    .limit(30)

  const niches = [...new Set(videos?.map(v => v.niche) || [])]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🔥 Daily Inspiration</h1>
        <p className="text-gray-400 mb-6">Top outlier videos from your niche. Updated every morning.</p>

        {niches.map(niche => (
          <div key={niche} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 capitalize">{niche}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos?.filter(v => v.niche === niche).map(video => (
                <div key={video.id} className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition">
                  <img src={video.thumbnail_url} alt={video.title} className="w-full aspect-video object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-600 text-xs px-2 py-1 rounded-full">{video.outlier_multiplier?.toFixed(1)}x outlier</span>
                      <span className="text-gray-400 text-xs">{video.view_count?.toLocaleString()} views</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2 line-clamp-2">{video.title}</h3>
                    {video.ai_breakdown && (
                      <p className="text-xs text-gray-400 mb-3">{video.ai_breakdown}</p>
                    )}
                    <div className="flex gap-2">
                      <a href={`https://youtube.com/watch?v=${video.video_id}`} target="_blank" className="text-xs text-blue-400 hover:underline">Watch</a>
                      <a href={`/tool?ref=${video.video_id}`} className="text-xs text-white hover:underline">Analyze</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {(!videos || videos.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-400">No outliers found yet. Check back tomorrow morning.</p>
          </div>
        )}
      </div>
    </div>
  )
}
