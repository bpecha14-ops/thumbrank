"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Target, Flame, Award, TrendingUp, ArrowRight } from "lucide-react";

function RadarChart({ components }: { components: { label: string; value: number }[] }) {
  const size = 280;
  const center = size / 2;
  const radius = 90;
  const angleStep = (Math.PI * 2) / components.length;

  const points = components
    .map((c, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (c.value / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {[25, 50, 75, 100].map((level) => {
        const r = (level / 100) * radius;
        return <circle key={level} cx={center} cy={center} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}
      {components.map((c, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <g key={c.label}>
            <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x={x + (x > center ? 8 : -8)} y={y + 4} textAnchor={x > center ? "start" : "end"} fill="rgba(255,255,255,0.4)" fontSize="11">{c.label}</text>
          </g>
        );
      })}
      <polygon points={points} fill="rgba(168,85,247,0.25)" stroke="#a855f7" strokeWidth="2" />
      {components.map((c, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (c.value / 100) * radius;
        return <circle key={i} cx={center + r * Math.cos(angle)} cy={center + r * Math.sin(angle)} r="3" fill="#a855f7" />;
      })}
    </svg>
  );
}

export default function YouPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/fingerprint")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center">Loading...</div>;

  if (data?.empty) {
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
        <div className="pt-28 pb-12 px-4 sm:px-6 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Your Packaging Fingerprint</h1>
          <p className="text-white/50 mb-8">Analyze thumbnails to unlock your personal radar chart, streaks, and niche percentile.</p>
          <Link href="/tool" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all">
            Analyze First Thumbnail <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  const adviceMap: Record<string, string> = {
    contrast: "Increase brightness difference between subject and background. Use complementary colors.",
    text: "Make text larger, bolder, and place it on a solid color block for readability.",
    focal: "Center your main subject. Use the rule of thirds and avoid dead center unless intentional.",
    clutter: "Remove 1-2 elements. One hero, one message, one reaction.",
  };

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
          <Target className="w-6 h-6 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Your Packaging Fingerprint</h1>
        </div>
        <p className="text-white/50 mb-8">How your thumbnails perform across 4 core dimensions.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Performance Radar</h2>
            <RadarChart components={data.components} />
            <div className="text-center mt-4">
              <div className="text-4xl font-bold text-white">{data.total}</div>
              <div className="text-xs text-white/40">Avg. Score</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{data.level}</div>
                <div className="text-xs text-white/40">{data.count} / {data.nextLevel} analyses to next level</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{data.streak} week{data.streak !== 1 ? "s" : ""}</div>
                <div className="text-xs text-white/40">Score 70+ streak</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Top {data.percentile}%</div>
                <div className="text-xs text-white/40">In your niche (calibrating...)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Focus Area</h2>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="text-white font-medium mb-1">Your weakest: {data.weakest.label} ({data.weakest.value}/100)</div>
              <div className="text-sm text-white/50">{adviceMap[data.weakest.key] || "Keep analyzing to improve."}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
