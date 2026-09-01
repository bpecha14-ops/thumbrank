"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";

export default function RescuePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/rescue-reports")
      .then((r) => r.json())
      .then((data) => {
        setReports(data.reports || []);
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
          <RefreshCw className="w-6 h-6 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Rescue Scanner</h1>
        </div>
        <p className="text-white/50 mb-8">
          Videos with good content but underperforming thumbnails. New cover = new life.
        </p>

        {loading ? (
          <p className="text-white/40">Loading...</p>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No rescue candidates yet</h3>
            <p className="text-sm text-white/40 mb-4">
              We scan your channel every Sunday. If a video has good retention but low CTR, it will appear here.
            </p>
            <span className="text-xs text-white/20">Next scan: this Sunday at 06:00 UTC</span>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r: any) => (
              <div
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-start gap-4 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden">
                  {r.thumbnail_url ? (
                    <img src={r.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No thumb</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate mb-1">
                    {r.title || "Unknown video"}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                    <span className="text-red-400">CTR: {r.ctr?.toFixed(2)}%</span>
                    <span>Median: {r.channel_median_ctr?.toFixed(2)}%</span>
                    <span>{r.impressions?.toLocaleString()} impressions</span>
                  </div>
                  <div className="text-xs text-amber-400/70 mb-2">
                    This video gets views but the thumbnail is killing clicks. Try a new cover.
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://youtube.com/watch?v=${r.video_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Open on YouTube
                    </a>
                    <Link
                      href="/tool"
                      className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Create new thumbnail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
