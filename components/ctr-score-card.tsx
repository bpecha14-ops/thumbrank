'use client';

import { CtrBreakdown } from '@/lib/ctr-score';
import { Gauge } from 'lucide-react';

export function CtrScoreCard({ breakdown }: { breakdown: CtrBreakdown }) {
  const color =
    breakdown.score >= 80 ? 'text-green-400' :
    breakdown.score >= 65 ? 'text-violet-400' :
    breakdown.score >= 45 ? 'text-yellow-400' :
    'text-red-400';

  const barColor =
    breakdown.score >= 80 ? 'bg-green-500' :
    breakdown.score >= 65 ? 'bg-violet-500' :
    breakdown.score >= 45 ? 'bg-yellow-500' :
    'bg-red-500';

  const factors = [
    { label: 'Contrast', value: Math.round(breakdown.contrast * 200), hint: 'How much the image pops' },
    { label: 'Colorfulness', value: Math.round(breakdown.colorfulness * 200), hint: 'Vibrancy of colors' },
    { label: 'Edge density', value: Math.round(breakdown.edgeDensity * 400), hint: 'Text/subject separation' },
    { label: 'Brightness', value: Math.round(breakdown.brightness * 100), hint: '0 = dark, 100 = bright' },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#111] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-violet-400" />
        <h3 className="text-sm font-semibold text-white">CTR Score</h3>
        <span className="ml-auto text-xs text-neutral-500">Pro feature</span>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <span className={`text-5xl font-bold ${color}`}>{breakdown.score}</span>
        <span className="text-lg text-neutral-500 mb-1">/ 100</span>
        <span className={`ml-auto text-sm font-medium ${color}`}>{breakdown.label}</span>
      </div>

      <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-5">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${breakdown.score}%` }} />
      </div>

      <div className="space-y-3">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-400">{f.label}</span>
              <span className="text-neutral-300">{f.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${Math.min(100, f.value)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
        Score is calculated from contrast, color saturation, edge density, and brightness. It runs entirely in your browser — no AI APIs.
      </p>
    </div>
  );
}
