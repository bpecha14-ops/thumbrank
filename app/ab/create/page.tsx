'use client';

import { useState } from 'react';
import Link from "next/link";
import { Sparkles, FlaskConical, Copy, Check, ArrowLeft } from "lucide-react";

export default function CreateABTest() {
  const [videoUrl, setVideoUrl] = useState('');
  const [variantA, setVariantA] = useState('');
  const [variantB, setVariantB] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

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

  function copyLink(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const inputClass =
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 " +
    "focus:outline-none focus:border-pink-500/60 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.15)] transition-all backdrop-blur-sm";

  return (
    <main className="min-h-screen text-white selection:bg-pink-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#07060F]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">ThumbRank</span>
          </Link>
          <Link href="/tool" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
            Try Free
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-4">
            <FlaskConical className="w-3 h-3 text-pink-400" />
            External Traffic Split
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">A/B Test</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Two thumbnail links, one video. Share both, watch which one wins the click — before YouTube decides for you.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2 font-medium text-center">YouTube Video URL</label>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2 font-medium text-center">
                Thumbnail A URL <span className="text-pink-400">(variant A)</span>
              </label>
              <input
                type="url"
                required
                value={variantA}
                onChange={e => setVariantA(e.target.value)}
                placeholder="https://example.com/thumb-a.jpg"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2 font-medium text-center">
                Thumbnail B URL <span className="text-blue-400">(variant B)</span>
              </label>
              <input
                type="url"
                required
                value={variantB}
                onChange={e => setVariantB(e.target.value)}
                placeholder="https://example.com/thumb-b.jpg"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating…' : 'Create A/B Test'}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-b from-pink-500/[0.07] to-transparent backdrop-blur-sm p-8">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Test created! 🎉</h2>
              <p className="text-white/50 text-sm mb-6 text-center">Share each link with a different audience. Dashboard shows live clicks.</p>

              <div className="space-y-4">
                {[
                  { key: 'a', label: 'Link A — variant A', url: result.links.a, color: 'pink' },
                  { key: 'b', label: 'Link B — variant B', url: result.links.b, color: 'blue' },
                  { key: 'dash', label: 'Dashboard (keep private)', url: result.links.dashboard, color: 'white' },
                ].map((item) => (
                  <div key={item.key} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className={`text-sm font-medium ${item.color === 'pink' ? 'text-pink-400' : item.color === 'blue' ? 'text-blue-400' : 'text-white/60'}`}>
                        {item.label}
                      </p>
                      <button
                        onClick={() => copyLink(item.url, item.key)}
                        className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                      >
                        {copied === item.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === item.key ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm break-all hover:text-pink-400 transition-colors">
                      {item.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
            >
              Create Another Test
            </button>
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
