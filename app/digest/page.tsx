"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Sunrise, ExternalLink } from "lucide-react";

export default function DigestPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/digest")
      .then((r) => r.json())
      .then((d) => {
        setVideos(d.videos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#030305] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030305]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">ThumbRank</span>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Sunrise className="w-6 h-6 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Morning Briefing</h1>
        </div>
        <p className="text-white/50 mb-8">What your competitors published while you slept.</p>

        {loading ? (
          <p className="text-white/40">Loading...</p>
        ) : videos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="text-white/40 mb-4">No competitor videos yet. Add competitors to see their latest uploads here.</p>
            <Link href="/competitors" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-all">
              Add Competitors
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((v: any) => (
              <div
                key={v.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="w-full h-32 rounded-lg bg-white/5 mb-3 overflow-hidden">
                  {v.thumbnail_url ? (
                    <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No thumb</div>
                  )}
                </div>
                <div className="text-sm text-white font-medium line-clamp-2 mb-1">{v.title}</div>
                <div className="text-xs text-white/40 mb-2">{v.channel_title}</div>
                <a
                  href={`https://youtube.com/watch?v=${v.video_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Watch
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
