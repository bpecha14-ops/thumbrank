export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompetitorsPage() {
  const supabase = createClient()

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Competitors</h1>
        <p className="text-gray-400 mb-8">ThumbRank tracks these channels every morning.</p>

        {(!competitors || competitors.length === 0) ? (
          <div className="border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-lg mb-4">Add your first competitor — ThumbRank will watch them every night.</p>
            <a href="/" className="inline-block px-6 py-3 bg-white text-black rounded-lg">Go to Tool</a>
          </div>
        ) : (
          <div className="space-y-4">
            {competitors.map((c: any) => (
              <div key={c.id} className="flex items-center gap-4 border border-gray-800 rounded-xl p-4">
                {c.channel_avatar ? (
                  <img src={c.channel_avatar} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl">📺</div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{c.channel_title || 'Unknown'}</h3>
                  <p className="text-sm text-gray-400">{c.avg_views?.toLocaleString() || 0} avg views</p>
                </div>
                <form action={`/api/competitors/delete?id=${c.id}`} method="POST">
                  <button type="submit" className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
