"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, Bell, ArrowRight, RefreshCw, Target } from "lucide-react";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/alerts")
      .then((r) => r.json())
      .then((d) => {
        setAlerts(d.alerts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeAlerts = alerts.filter((a: any) => a.sent === false);

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
          <Bell className="w-6 h-6 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>
        <p className="text-white/50 mb-8">Your channel health and active alerts.</p>

        {/* Active alerts badge */}
        {activeAlerts.length > 0 && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 mb-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold mb-1">
                {activeAlerts.length} active alert{activeAlerts.length > 1 ? "s" : ""}
              </div>
              <div className="text-sm text-white/50 mb-3">
                {activeAlerts.length} video{activeAlerts.length > 1 ? "s" : ""} with CTR below channel median. First 48 hours decide everything — change the thumbnail now.
              </div>
              <Link
                href="/tool"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                Fix now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* No alerts */}
        {!loading && activeAlerts.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center mb-6">
            <Target className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">All clear</h3>
            <p className="text-sm text-white/40">No CTR alerts. Your thumbnails are performing within normal range.</p>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/history" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Predictions</span>
            </div>
            <div className="text-2xl font-bold text-white">View history →</div>
          </Link>
          <Link href="/rescue" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <RefreshCw className="w-5 h-5" />
              <span className="text-sm font-medium">Rescue</span>
            </div>
            <div className="text-2xl font-bold text-white">Check scans →</div>
          </Link>
          <Link href="/you" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Fingerprint</span>
            </div>
            <div className="text-2xl font-bold text-white">Your profile →</div>
          </Link>
        </div>

        {/* Alert list */}
        {activeAlerts.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-white mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {activeAlerts.map((a: any) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-red-500/20 bg-white/[0.02] p-4 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate mb-1">
                      {a.title || "Video CTR drop detected"}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                      <span className="text-red-400">CTR: {a.ctr?.toFixed(2)}%</span>
                      <span>Median: {a.channel_median_ctr?.toFixed(2)}%</span>
                      <span>{a.impressions?.toLocaleString()} impressions</span>
                    </div>
                    <Link
                      href="/tool"
                      className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Create new thumbnail <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
