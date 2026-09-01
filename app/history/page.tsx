"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, Target, Share2 } from "lucide-react";

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [ctrData, setCtrData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/predictions").then((r) => r.json()),
      fetch("/api/analytics/ctr").then((r) => r.json()),
    ])
      .then(([preds, ctr]) => {
        setPredictions(preds.predictions || []);
        setCtrData(ctr.videos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const accuracy = predictions.filter((p: any) => p.was_correct === true).length;
  const total = predictions.filter((p: any) => p.was_correct !== null).length;
  const accuracyPct = total > 0 ? Math.round((accuracy / total) * 100) : 0;

  // Share PNG generator
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateSharePNG = (p: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0f0f1a");
    grad.addColorStop(0.5, "#1a0a2e");
    grad.addColorStop(1, "#0f0f1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Noise texture (subtle dots)
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    for (let i = 0; i < 3000; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    // Top accent line
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(80, 60, 120, 4);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px sans-serif";
    ctx.fillText("ThumbRank Prediction vs Reality", 80, 140);

    // Subtitle
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "28px sans-serif";
    const titleText = p.input_meta?.title || "Untitled Video";
    ctx.fillText(titleText.length > 50 ? titleText.slice(0, 50) + "..." : titleText, 80, 200);

    // Prediction box
    ctx.fillStyle = "rgba(168,85,247,0.15)";
    ctx.strokeStyle = "rgba(168,85,247,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, 260, 480, 200, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("PREDICTION", 110, 310);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";
    const tierLabel = p.predicted_tier === "strong" ? "STRONG" : p.predicted_tier === "ok" ? "OK" : "WEAK";
    ctx.fillText(`${tierLabel} (${p.predicted_score})`, 110, 370);

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "20px sans-serif";
    ctx.fillText("ThumbRank AI Score", 110, 410);

    // Reality box
    const hasActual = p.actual_ctr_72h !== null && p.actual_ctr_72h !== undefined;
    ctx.fillStyle = hasActual ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)";
    ctx.strokeStyle = hasActual ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.roundRect(620, 260, 500, 200, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = hasActual ? "#22c55e" : "rgba(255,255,255,0.4)";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(hasActual ? "REALITY (72h)" : "WAITING...", 650, 310);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";
    if (hasActual) {
      ctx.fillText(`${p.actual_ctr_72h}% CTR`, 650, 370);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "20px sans-serif";
      ctx.fillText(p.was_correct ? "✅ Prediction correct" : "❌ Prediction missed", 650, 410);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "24px sans-serif";
      ctx.fillText("Check back in 72 hours", 650, 360);
    }

    // Watermark
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("thumbrankpro.com", 80, 580);

    // Download
    const link = document.createElement("a");
    link.download = `thumbrank-proof-${p.id?.slice(0, 8)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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
        <h1 className="text-3xl font-bold text-white mb-2">Prediction History</h1>
        <p className="text-white/50 mb-8">Track how well ThumbRank predicts your thumbnail performance.</p>

        {loading ? (
          <p className="text-white/40">Loading...</p>
        ) : (
          <>
            {/* Stats */}
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

            {/* Proof it works */}
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Proof it works
            </h2>
            <div className="space-y-4 mb-10">
              {predictions.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-white/40">
                  No predictions yet. Analyze a thumbnail in the{" "}
                  <Link href="/tool" className="text-purple-400 underline">tool</Link> to start tracking.
                </div>
              )}

              {predictions.slice(0, 10).map((p: any) => {
                const hasActual = p.actual_ctr_72h !== null && p.actual_ctr_72h !== undefined;
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium truncate mb-1">
                          {p.input_meta?.title || "Untitled"}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span>
                            Predicted:{" "}
                            <span
                              className={
                                p.predicted_tier === "strong"
                                  ? "text-emerald-400"
                                  : p.predicted_tier === "ok"
                                  ? "text-amber-400"
                                  : "text-rose-400"
                              }
                            >
                              {p.predicted_tier} ({p.predicted_score})
                            </span>
                          </span>
                          {hasActual && (
                            <span>
                              Reality:{" "}
                              <span className="text-emerald-400">{p.actual_ctr_72h}% CTR</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            p.was_correct === true
                              ? "bg-emerald-500/10 text-emerald-400"
                              : p.was_correct === false
                              ? "bg-red-500/10 text-red-400"
                              : "bg-white/5 text-white/40"
                          }`}
                        >
                          {p.was_correct === true
                            ? "✅ Correct"
                            : p.was_correct === false
                            ? "❌ Miss"
                            : "⏳ Pending"}
                        </span>
                        <button
                          onClick={() => generateSharePNG(p)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/60 hover:text-purple-400 transition-all"
                          title="Share as PNG"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {!hasActual && (
                      <div className="mt-3 text-xs text-white/30">
                        Waiting for 72h CTR data from YouTube Analytics...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hidden canvas for PNG generation */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        )}
      </div>
    </main>
  );
}
