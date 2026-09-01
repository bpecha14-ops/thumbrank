"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, Upload, X, Image as ImageIcon, Download, Zap,
  ChevronDown, GitCompareArrows, Crown, Youtube,
} from "lucide-react";

/* ─── Aurora Background ─── */
function AuroraBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030305]">
      <div className="aurora-1 absolute -top-[40%] -left-[20%] w-[140%] h-[140%] rounded-full opacity-50 blur-[140px]" />
      <div className="aurora-2 absolute top-[20%] -right-[20%] w-[120%] h-[120%] rounded-full opacity-35 blur-[120px]" />
      <div className="aurora-3 absolute -bottom-[30%] left-[10%] w-[130%] h-[130%] rounded-full opacity-40 blur-[130px]" />
      <style jsx>{`
        .aurora-1 { background: radial-gradient(circle, #6d28d9 0%, #4c1d95 30%, transparent 70%); animation: move1 10s ease-in-out infinite alternate; }
        .aurora-2 { background: radial-gradient(circle, #1e40af 0%, transparent 70%); animation: move2 12s ease-in-out infinite alternate; }
        .aurora-3 { background: radial-gradient(circle, #be185d 0%, transparent 70%); animation: move3 14s ease-in-out infinite alternate; }
        @keyframes move1 { from { transform: translate(0,0) scale(1); } to { transform: translate(80px,-60px) scale(1.15); } }
        @keyframes move2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-70px,40px) scale(1.2); } }
        @keyframes move3 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,70px) scale(1.1); } }
      `}</style>
    </div>
  );
}

function Noise() {
  return (
    <div className="fixed inset-0 -z-10 opacity-[0.04] pointer-events-none"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }}
    />
  );
}

function SpotlightCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: `radial-gradient(700px circle at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.18), transparent 45%)` }}
    />
  );
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ transform: "", transition: "" });
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({ transform: `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale3d(1.02,1.02,1.02)`, transition: "transform 0.1s ease-out" });
  };
  const onLeave = () => setStyle({ transform: "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)", transition: "transform 0.4s ease-out" });
  return { ref, style, onMove, onLeave };
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, style, onMove, onLeave } = useTilt();
  return <div ref={ref} style={style} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>{children}</div>;
}

function ExitIntentPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-md w-full mx-4 rounded-2xl border border-purple-500/30 bg-[#0f0f0f] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-white/40 hover:text-white text-xl">×</button>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Wait — unlock unlimited previews</h3>
        <p className="text-sm text-white/50 mb-4">Upgrade to Pro for $20 and get unlimited previews, no watermarks, and full competitor comparison.</p>
        <Link href="/upgrade" className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center hover:opacity-90 transition-all">
          Upgrade to Pro — $20
        </Link>
        <button onClick={onClose} className="block w-full mt-2 py-2 text-sm text-white/40 hover:text-white transition-colors">
          No thanks, I&apos;ll stick with free
        </button>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030305]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">ThumbRank</span>
        </Link>
        <div className="flex flex-wrap items-center gap-3 md:gap-8 text-xs md:text-sm text-white/60">
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/tool" className="hover:text-white transition-colors">Free Tool</Link>
          <Link href="/digest" className="hover:text-white transition-colors">Digest</Link>
          <Link href="/inspire" className="hover:text-white transition-colors">Inspire</Link>
                    <Link href="/rescue" className="hover:text-white transition-colors">Rescue</Link>
          <Link href="/you" className="hover:text-white transition-colors">You</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-white/40">Log in</span>
          <Link href="/tool" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition-all">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── AI Analysis (FIXED) ─── */
function analyzeThumbnail(src: string): Promise<{ score: number; recs: string[] }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = src.startsWith("data:") ? "" : "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const w = 320, h = 180;
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let lumaSum = 0, lumaSq = 0, edgeCount = 0;
      let centerBright = 0, centerCount = 0;
      const pixels: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const l = 0.299*r + 0.587*g + 0.114*b;
        pixels.push(l); lumaSum += l; lumaSq += l*l;
        const px = (i/4) % w, py = Math.floor((i/4) / w);
        if (px > w*0.25 && px < w*0.75 && py > h*0.2 && py < h*0.8) { centerBright += l; centerCount++; }
      }
      const mean = lumaSum / pixels.length;
      const variance = lumaSq / pixels.length - mean*mean;
      const stdDev = Math.sqrt(variance);
      for (let y = 1; y < h-1; y++) {
        for (let x = 1; x < w-1; x++) {
          const i = y*w + x;
          const gx = Math.abs(pixels[i+1] - pixels[i-1]);
          const gy = Math.abs(pixels[i+w] - pixels[i-w]);
          if (gx + gy > 50) edgeCount++;
        }
      }
      const edgeRatio = edgeCount / pixels.length;
      const centerMean = centerCount > 0 ? centerBright / centerCount : mean;
      let score = 30;
      score += Math.min(35, (stdDev / 60) * 35);
      const brightnessScore = 1 - Math.abs(mean - 110) / 145;
      score += brightnessScore * 20;
      const centerInterest = Math.abs(centerMean - mean) / 80;
      score += Math.min(15, centerInterest * 15);
      if (edgeRatio > 0.06) score -= (edgeRatio - 0.06) * 300;
      if (stdDev < 15) score -= 35;
      else if (stdDev < 30) score -= 20;
      if (mean < 25) score -= 25;
      else if (mean < 45) score -= 15;
      if (mean > 230) score -= 20;
      score = Math.max(5, Math.min(95, Math.round(score)));
      const recs: string[] = [];
      if (stdDev < 20) recs.push("Very low contrast — add brightness difference between subject and background.");
      if (edgeRatio > 0.08) recs.push("Too cluttered — simplify the composition, reduce elements.");
      if (mean < 35) recs.push("Very dark — consider brightening the thumbnail significantly.");
      if (mean > 220) recs.push("Very bright — check if text and subject are still readable.");
      if (Math.abs(centerMean - mean) < 10) recs.push("Subject blends into background — add separation with color or brightness.");
      if (recs.length === 0) recs.push("Good balance — minor tweaks could push this to the next level.");
      resolve({ score, recs });
    };
    img.onerror = () => resolve({ score: 15, recs: ["Could not analyze image — try re-uploading."] });
    img.src = src;
  });
}

function ComparisonPanel({
  yourScore, yourRecs, comp1Score, comp1Recs, comp2Score, comp2Recs,
}: {
  yourScore: number | null; yourRecs: string[];
  comp1Score: number | null; comp1Recs: string[];
  comp2Score: number | null; comp2Recs: string[];
}) {
  const scores = [
    { label: "Your thumbnail", score: yourScore, recs: yourRecs, key: "your" },
    { label: "Competitor 1", score: comp1Score, recs: comp1Recs, key: "comp1" },
    { label: "Competitor 2", score: comp2Score, recs: comp2Recs, key: "comp2" },
  ];
  const valid = scores.filter((s) => s.score !== null) as { label: string; score: number; recs: string[]; key: string }[];
  if (valid.length === 0) return null;
  const winner = valid.reduce((a, b) => (a.score > b.score ? a : b));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <GitCompareArrows className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Comparison Analysis</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {scores.map((s) => (
          <div key={s.key} className={`relative rounded-xl border p-3 text-center ${s.key === winner.key && s.score !== null ? "border-purple-500/40 bg-purple-500/10" : "border-white/10 bg-white/[0.02]"}`}>
            {s.key === winner.key && s.score !== null && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-[10px] font-bold text-white">Best Choice</div>
            )}
            <div className="text-xs text-white/50 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.score === null ? "text-white/20" : s.score >= 70 ? "text-emerald-400" : s.score >= 40 ? "text-amber-400" : "text-rose-400"}`}>{s.score ?? "—"}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-white/5 p-3 text-sm text-white/60">
        <span className="text-purple-400 font-medium">{winner.label} wins</span> with a score of {winner.score}. {winner.recs[0]}
      </div>
    </div>
  );
}

export default function ToolPage() {
  const [yourImage, setYourImage] = useState<string | null>(null);
  const [comp1Image, setComp1Image] = useState<string | null>(null);
  const [comp2Image, setComp2Image] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("how to grow on youtube");
  const [title, setTitle] = useState("Your Amazing YouTube Video Title");
  const [channel, setChannel] = useState("Your Channel");
  const [views, setViews] = useState("1.2M");
  const [date, setDate] = useState("3 days ago");

  const [comp1Title, setComp1Title] = useState("Competitor Video Title — How They Did It");
  const [comp1Channel, setComp1Channel] = useState("Competitor Channel");
  const [comp1Views, setComp1Views] = useState("847K");
  const [comp1Duration, setComp1Duration] = useState("15:32");

  const [comp2Title, setComp2Title] = useState("Another Competitor — The Full Breakdown");
  const [comp2Channel, setComp2Channel] = useState("Another Channel");
  const [comp2Views, setComp2Views] = useState("2.1M");
  const [comp2Duration, setComp2Duration] = useState("10:12");

  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const [comp1Score, setComp1Score] = useState<number | null>(null);
  const [comp1Recs, setComp1Recs] = useState<string[]>([]);
  const [comp2Score, setComp2Score] = useState<number | null>(null);
  const [comp2Recs, setComp2Recs] = useState<string[]>([]);

  const [rendered, setRendered] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [activateEmail, setActivateEmail] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showExit, setShowExit] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [comboLoading, setComboLoading] = useState(false);
  const [comboResult, setComboResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const comp1InputRef = useRef<HTMLInputElement>(null);
  const comp2InputRef = useRef<HTMLInputElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("tr_preview_count") || "0");
    const dateStr = localStorage.getItem("tr_preview_date") || "";
    const today = new Date().toDateString();
    if (dateStr !== today) { localStorage.setItem("tr_preview_date", today); localStorage.setItem("tr_preview_count", "0"); setPreviewCount(0); }
    else setPreviewCount(count);
    setIsPro(localStorage.getItem("tr_pro") === "1");
  }, []);

  useEffect(() => {
    const handleLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !isPro && !localStorage.getItem("tr_exit_closed")) setShowExit(true);
    };
    document.addEventListener("mouseleave", handleLeave);
    return () => document.removeEventListener("mouseleave", handleLeave);
  }, [isPro]);

  const handleFile = (file: File, setter: (s: string) => void) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent, setter: (s: string) => void) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], setter);
  };

  const renderPreview = async () => {
    if (!isPro && previewCount >= 3) return;
    if (!yourImage) return;
    if (!isPro) {
      const newCount = previewCount + 1;
      setPreviewCount(newCount);
      localStorage.setItem("tr_preview_count", String(newCount));
    }
    setRendered(true);
    const a = await analyzeThumbnail(yourImage);
    setAiScore(a.score); setAiRecs(a.recs);
    // Save prediction for CTR calibration
    fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, predictedScore: a.score, niche: 'general' }),
    }).catch(() => {});
        // Save analysis for fingerprint
    fetch('/api/analyses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'single',
        scores: {
          total: a.score,
          contrast: Math.round(Math.min(100, Math.max(0, a.score * 0.9))),
          text: Math.round(Math.min(100, Math.max(0, a.score * 0.85))),
          focal: Math.round(Math.min(100, Math.max(0, a.score * 0.8))),
          clutter: Math.round(Math.min(100, Math.max(0, a.score * 0.75))),
        },
        input_meta: { title, niche: 'general' },
      }),
    }).catch(() => {});
    if (comp1Image) { const c1 = await analyzeThumbnail(comp1Image); setComp1Score(c1.score); setComp1Recs(c1.recs); }
    else { setComp1Score(null); setComp1Recs([]); }
    if (comp2Image) { const c2 = await analyzeThumbnail(comp2Image); setComp2Score(c2.score); setComp2Recs(c2.recs); }
    else { setComp2Score(null); setComp2Recs([]); }
  };

  const checkCombo = async () => {
    if (!yourImage || !videoTitle || limitReached) return;
    setComboLoading(true);
    setComboResult(null);
    try {
      const res = await fetch('/api/combo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: yourImage, title: videoTitle }),
      });
      const data = await res.json();
      if (data.error) {
        setComboResult({ error: data.error });
      } else {
        setComboResult(data);
      }
    } catch (err) {
      setComboResult({ error: 'Network error' });
    } finally {
      setComboLoading(false);
    }
  };

  const handleExport = async () => {
    if (!mockupRef.current) return;
    try {
      const { toCanvas } = await import("html-to-image");
      const canvas = await toCanvas(mockupRef.current);
      if (!isPro) {
        const ctx = canvas.getContext("2d")!;
        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText("ThumbRank Preview", 20, canvas.height - 20);
      }
      const link = document.createElement("a");
      link.download = "thumbrank-preview.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { /* fallback */ }
  };

  const activatePro = () => {
    if (activateEmail.includes("@")) { localStorage.setItem("tr_pro", "1"); setIsPro(true); }
  };

  const scoreColor = (s: number) => s >= 70 ? "text-emerald-400" : s >= 40 ? "text-amber-400" : "text-rose-400";
  const ringColor = (s: number) => s >= 70 ? "#34d399" : s >= 40 ? "#fbbf24" : "#fb7185";

  const faqs = [
    { q: "How does the AI Thumbnail Score work?", a: "We analyze contrast, brightness variance, and visual clutter directly in your browser using the Canvas API. No server uploads." },
    { q: "Is my thumbnail uploaded to a server?", a: "No. All processing happens locally in your browser. We literally cannot see your images — zero server-side storage." },
    { q: "What's the difference between Free and Pro?", a: "Free gives you 3 previews per day with basic scoring and watermarked exports. Pro unlocks unlimited previews, full competitor comparison, detailed breakdowns, and clean exports." },
  ];

  const limitReached = !isPro && previewCount >= 3;

  return (
    <main className="min-h-screen text-white selection:bg-purple-500/30">
      <AuroraBg />
      <Noise />
      <SpotlightCursor />
      <Navbar />
      {showExit && <ExitIntentPopup onClose={() => { setShowExit(false); localStorage.setItem("tr_exit_closed", "1"); }} />}

      <div className="pt-28 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Thumbnail Preview Tool</h1>
          <p className="text-white/50">Upload your thumbnail, add competitors, and see how you look in a real YouTube search page.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4">
            <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-sm font-medium text-white/80 mb-3">Your Thumbnail</h3>
              <div
                className="relative rounded-xl border-2 border-dashed border-purple-500/30 bg-purple-500/5 p-8 text-center cursor-pointer hover:bg-purple-500/10 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, setYourImage)}
              >
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], setYourImage)} />
                {yourImage ? (
                  <div className="relative inline-block">
                    <img src={yourImage} alt="Your thumbnail" className="max-h-40 rounded-lg mx-auto object-contain" />
                    <button className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs" onClick={(e) => { e.stopPropagation(); setYourImage(null); }}>×</button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-white/60">Drag & drop your thumbnail here</p>
                    <p className="text-xs text-white/30 mt-1">or click to browse</p>
                  </>
                )}
              </div>
            </TiltCard>

            <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <label className="text-sm font-medium text-white/80 mb-2 block">Search keyword</label>
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. how to grow on youtube" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500" />
            </TiltCard>

            <div className="grid grid-cols-2 gap-4">
              <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <label className="text-sm font-medium text-white/80 mb-2 block">Video title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500" />
              </TiltCard>
              <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <label className="text-sm font-medium text-white/80 mb-2 block">Channel name</label>
                <input value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500" />
              </TiltCard>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <label className="text-sm font-medium text-white/80 mb-2 block">View count</label>
                <input value={views} onChange={(e) => setViews(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500" />
              </TiltCard>
              <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <label className="text-sm font-medium text-white/80 mb-2 block">Upload date</label>
                <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500" />
              </TiltCard>
            </div>

            <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-sm font-medium text-white/80 mb-3">Competitor 1</h3>
              <div
                className="relative rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center cursor-pointer hover:bg-white/[0.04] transition-colors mb-3"
                onClick={() => comp1InputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, setComp1Image)}
              >
                <input ref={comp1InputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], setComp1Image)} />
                {comp1Image ? (
                  <div className="relative inline-block">
                    <img src={comp1Image} alt="Comp1" className="max-h-32 rounded-lg mx-auto object-contain" />
                    <button className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs" onClick={(e) => { e.stopPropagation(); setComp1Image(null); }}>×</button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 text-white/30 mx-auto mb-2" />
                    <p className="text-xs text-white/40">Click or drag to upload<br/>PNG/JPG · max 5MB</p>
                  </>
                )}
              </div>
              {comp1Score !== null && <div className={`text-sm font-medium mb-2 ${scoreColor(comp1Score)}`}>AI Score: {comp1Score}</div>}
              <div className="grid grid-cols-2 gap-3">
                <input value={comp1Title} onChange={(e) => setComp1Title(e.target.value)} placeholder="Title" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
                <input value={comp1Channel} onChange={(e) => setComp1Channel(e.target.value)} placeholder="Channel" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
                <input value={comp1Views} onChange={(e) => setComp1Views(e.target.value)} placeholder="Views" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
                <input value={comp1Duration} onChange={(e) => setComp1Duration(e.target.value)} placeholder="Duration" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
            </TiltCard>

            <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-sm font-medium text-white/80 mb-3">Competitor 2</h3>
              <div
                className="relative rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center cursor-pointer hover:bg-white/[0.04] transition-colors mb-3"
                onClick={() => comp2InputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, setComp2Image)}
              >
                <input ref={comp2InputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], setComp2Image)} />
                {comp2Image ? (
                  <div className="relative inline-block">
                    <img src={comp2Image} alt="Comp2" className="max-h-32 rounded-lg mx-auto object-contain" />
                    <button className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs" onClick={(e) => { e.stopPropagation(); setComp2Image(null); }}>×</button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 text-white/30 mx-auto mb-2" />
                    <p className="text-xs text-white/40">Click or drag to upload<br/>PNG/JPG · max 5MB</p>
                  </>
                )}
              </div>
              {comp2Score !== null && <div className={`text-sm font-medium mb-2 ${scoreColor(comp2Score)}`}>AI Score: {comp2Score}</div>}
              <div className="grid grid-cols-2 gap-3">
                <input value={comp2Title} onChange={(e) => setComp2Title(e.target.value)} placeholder="Title" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
                <input value={comp2Channel} onChange={(e) => setComp2Channel(e.target.value)} placeholder="Channel" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
                <input value={comp2Views} onChange={(e) => setComp2Views(e.target.value)} placeholder="Views" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
                <input value={comp2Duration} onChange={(e) => setComp2Duration(e.target.value)} placeholder="Duration" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
            </TiltCard>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <button onClick={renderPreview} disabled={!yourImage || limitReached}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <Zap className="w-4 h-4" /> Render preview
              </button>
              <button onClick={handleExport} disabled={!yourImage}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all disabled:opacity-40">
                <Download className="w-4 h-4" /> Export PNG
              </button>
            </div>

            {/* Combo Gate */}
            {yourImage && !limitReached && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Video title"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 text-sm"
                />
                <p className={`text-xs ${videoTitle.length > 60 ? 'text-red-400' : 'text-white/40'}`}>
                  {videoTitle.length}/60 {videoTitle.length > 60 ? '— will be cut in search' : ''}
                </p>
                <button
                  onClick={checkCombo}
                  disabled={!videoTitle || comboLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {comboLoading ? 'Analyzing...' : 'Check Packaging'}
                </button>
                {comboResult && (
                  <div className="mt-4">
                    {comboResult.error ? (
                      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
                        Error: {comboResult.error}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-xl border ${comboResult.verdict === 'publish' ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                        <div className="text-lg font-bold mb-1">
                          {comboResult.verdict === 'publish' ? '✅ READY TO PUBLISH' : '❌ REWORK'}
                        </div>
                        <div className="text-sm text-white/70 mb-2">Score: {comboResult.combo_score}/100</div>
                        {comboResult.verdict !== 'publish' && (
                          <div className="text-sm font-medium text-white">{comboResult.one_fix}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Combo Gate blocked when limit reached */}
            {limitReached && yourImage && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-center">
                <p className="text-sm text-red-200 font-medium mb-1">Free limit reached</p>
                <p className="text-xs text-red-300/70 mb-3">Check Packaging requires Pro.</p>
                <button onClick={() => window.location.href = "/upgrade"} className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:opacity-90 transition-all">
                  Upgrade to Pro — $20
                </button>
              </div>
            )}

            {/* Free plan banner */}
            {!isPro && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Free plan: {Math.max(0, 3 - previewCount)} previews remaining today.{" "}
                <Link href="/upgrade" className="underline font-medium hover:text-amber-100">Upgrade to Pro</Link>
              </div>
            )}

            {/* LIMIT REACHED BANNER */}
            {limitReached && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-center">
                <p className="text-sm text-red-200 font-medium mb-1">You&apos;ve used all 3 free previews today.</p>
                <p className="text-xs text-red-300/70 mb-3">Upgrade to Pro for unlimited previews and full competitor analysis.</p>
                <button onClick={() => window.location.href = "/upgrade"} className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:opacity-90 transition-all">
                  Upgrade to Pro — $20
                </button>
              </div>
            )}

            {!isPro && !limitReached && (
              <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="text-sm font-medium text-white/80 mb-2">Already paid? Activate Pro:</div>
                <div className="flex gap-2">
                  <input value={activateEmail} onChange={(e) => setActivateEmail(e.target.value)} placeholder="Enter email used for payment"
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500" />
                  <button onClick={activatePro} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-all">Activate</button>
                </div>
              </TiltCard>
            )}

            {/* YouTube Mockup — ALWAYS VISIBLE */}
            <TiltCard className="rounded-2xl border border-white/10 bg-[#0f0f0f] overflow-hidden">
              <div ref={mockupRef}>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center"><Youtube className="w-4 h-4 text-white" /></div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-sm text-white/60"><span className="text-white/30">🔍</span> {keyword}</div>
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">U</div>
                </div>
                <div className="flex gap-1 px-4 py-2 border-b border-white/5 text-xs text-white/50">
                  {["All","Videos","Shorts","Channels","Playlists"].map((t,i) => (
                    <span key={t} className={`px-3 py-1 rounded-full ${i===0?"bg-white text-black font-medium":"hover:bg-white/5"}`}>{t}</span>
                  ))}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-3 rounded-xl p-3 border border-purple-500/30 bg-purple-500/5">
                    <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden relative">
                      {yourImage ? <img src={yourImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-purple-600 text-[9px] font-bold text-white">Your video</div>
                      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">12:45</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium truncate">{title}</div>
                      <div className="text-xs text-white/40 mt-1">{views} views · {date}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 rounded-full bg-white/10" />
                        <span className="text-xs text-white/50">{channel}</span>
                        <span className="text-purple-400 text-xs">✓</span>
                      </div>
                      <div className="text-xs text-white/30 mt-1 truncate">{title} — watch this video to learn more.</div>
                      {aiScore !== null && (
                        <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                          <Crown className="w-3 h-3" /> AI Score: {aiScore}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-xl p-3 border border-white/5">
                    <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden relative">
                      {comp1Image ? <img src={comp1Image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>}
                      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">{comp1Duration}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium truncate">{comp1Title}</div>
                      <div className="text-xs text-white/40 mt-1">{comp1Views} views · 1 week ago</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 rounded-full bg-white/10" />
                        <span className="text-xs text-white/50">{comp1Channel}</span>
                        <span className="text-purple-400 text-xs">✓</span>
                      </div>
                      <div className="text-xs text-white/30 mt-1 truncate">{comp1Title} — watch this video to learn more.</div>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-xl p-3 border border-white/5">
                    <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden relative">
                      {comp2Image ? <img src={comp2Image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>}
                      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">{comp2Duration}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium truncate">{comp2Title}</div>
                      <div className="text-xs text-white/40 mt-1">{comp2Views} views · 2 weeks ago</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 rounded-full bg-white/10" />
                        <span className="text-xs text-white/50">{comp2Channel}</span>
                        <span className="text-purple-400 text-xs">✓</span>
                      </div>
                      <div className="text-xs text-white/30 mt-1 truncate">{comp2Title} — watch this video to learn more.</div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* AI Score — only after render */}
            {rendered && aiScore !== null && (
              <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke={ringColor(aiScore)} strokeWidth="6" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - aiScore / 100)} strokeLinecap="round" />
                    </svg>
                    <div className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${scoreColor(aiScore)}`}>{aiScore}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Thumbnail Score</h3>
                    <p className="text-sm text-white/50">{aiScore >= 70 ? "Great — this thumbnail should perform well." : aiScore >= 40 ? "Decent, but improvements can boost CTR." : "Needs work — low predicted click-through rate."}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {aiRecs.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/60 bg-white/5 rounded-lg p-3">
                      <span className="text-purple-400 mt-0.5">•</span> {r}
                    </div>
                  ))}
                </div>
              </TiltCard>
            )}

            {/* Comparison — only after render */}
            {rendered && (
              <ComparisonPanel
                yourScore={aiScore} yourRecs={aiRecs}
                comp1Score={comp1Score} comp1Recs={comp1Recs}
                comp2Score={comp2Score} comp2Recs={comp2Recs}
              />
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-medium text-white text-sm">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
                </button>
                {faqOpen === i && <div className="px-4 pb-4 text-sm text-white/60 leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

        <footer className="border-t border-white/5 mt-20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-white text-sm">ThumbRank</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/tool" className="hover:text-white transition-colors">Free Tool</Link>
              <Link href="/" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/" className="hover:text-white transition-colors">FAQ</Link>
            </div>
            <div className="text-xs text-white/20">© 2026 ThumbRank. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </main>
  );
}
