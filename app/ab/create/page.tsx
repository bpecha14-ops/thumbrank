'use client';

import { useState } from 'react';

export default function CreateABTest() {
  const [videoUrl, setVideoUrl] = useState('');
  const [variantA, setVariantA] = useState('');
  const [variantB, setVariantB] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/ab/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video_url: videoUrl,
        variant_a_url: variantA,
        variant_b_url: variantB,
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Create A/B Test</h1>

      {!result ? (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label className="block text-zinc-400 mb-1">YouTube Video URL</label>
            <input
              type="url"
              required
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Thumbnail A URL</label>
            <input
              type="url"
              required
              value={variantA}
              onChange={e => setVariantA(e.target.value)}
              placeholder="https://example.com/thumb-a.jpg"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Thumbnail B URL</label>
            <input
              type="url"
              required
              value={variantB}
              onChange={e => setVariantB(e.target.value)}
              placeholder="https://example.com/thumb-b.jpg"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create A/B Test'}
          </button>
        </form>
      ) : (
        <div className="max-w-lg space-y-4">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold text-purple-300 mb-4">Test Created!</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-zinc-400 text-sm">Link A (share this):</p>
                <a href={result.links.a} target="_blank" className="text-purple-400 break-all hover:underline">
                  {result.links.a}
                </a>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Link B (share this):</p>
                <a href={result.links.b} target="_blank" className="text-purple-400 break-all hover:underline">
                  {result.links.b}
                </a>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Dashboard:</p>
                <a href={result.links.dashboard} target="_blank" className="text-purple-400 break-all hover:underline">
                  {result.links.dashboard}
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg"
          >
            Create Another Test
          </button>
        </div>
      )}
    </div>
  );
}
