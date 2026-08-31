"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [ctrData, setCtrData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/user/predictions').then(r => r.json()),
      fetch('/api/analytics/ctr').then(r => r.json()),
    ]).then(([preds, ctr]) => {
      setPredictions(preds.predictions || []);
      setCtrData(ctr.videos || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const accuracy = predictions.filter((p: any) => p.was_correct === true).length;
  const total = predictions.filter((p: any) => p.was_correct !== null).length;
  const accuracyPct = total > 0 ? Math.round((accuracy / total) * 100) : 0;

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
        <h1 className="text-3xl font-bold text-white mb-2">Prediction History</h1>
        <p className="text-white/50 mb-8">Track how well ThumbRank predicts your thumbnail performance.</p>

        {loading ? (
          <p className="text-white/40">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-medium">Accuracy</span>
                </div>
                <div className="text-3xl font-bold text-white">{accuracyPct}%</div>
                <div className="text-xs text-white/40">{total} calibrated predictions</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Predictions</span>
                </div>
                <div className="text-3xl font-bold text-white">{predictions.length}</div>
                <div className="text-xs text-white/40">Total analyzed</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Videos Tracked</span>
                </div>
                <div className="text-3xl font-bold text-white">{ctrData.length}</div>
                <div className="text-xs text-white/40">From YouTube Analytics</div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">Recent Predictions</h2>
            <div className="space-y-3">
              {predictions.slice(0, 10).map((p: any) => (
                <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">{p.input_meta?.title || 'Untitled'}</div>
                    <div className="text-xs text-white/40">Predicted: {p.predicted_tier} ({p.predicted_score})</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.was_correct === true ? 'bg-emerald-500/10 text-emerald-400' :
                    p.was_correct === false ? 'bg-red-500/10 text-red-400' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {p.was_correct === true ? '✅ Correct' :
                     p.was_correct === false ? '❌ Miss' :
                     '⏳ Pending'}
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
