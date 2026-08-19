"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { createClient } from "@supabase/supabase-js";
import { SiteNav } from "@/components/site-nav";
import ExitIntentPopup from "@/components/exit-intent-popup";
import ComparisonPanel from "@/components/comparison-panel";

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AiAnalysis {
  score: number;
  recommendations: string[];
}

function analyzeThumbnail(imageUrl: string): Promise<AiAnalysis> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const w = 320;
      const h = (img.height / img.width) * w;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const data = ctx.getImageData(0, 0, w, h).data;
      let totalR = 0, totalG = 0, totalB = 0, totalLuma = 0;
      let minLuma = 255, maxLuma = 0;
      const pixels = w * h;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        totalR += r; totalG += g; totalB += b; totalLuma += luma;
        if (luma < minLuma) minLuma = luma;
        if (luma > maxLuma) maxLuma = luma;
      }

      const avgLuma = totalLuma / pixels;
      const contrast = maxLuma - minLuma;
      const saturation =
        pixels > 0
          ? (Math.abs(totalR - totalG) + Math.abs(totalR - totalB) + Math.abs(totalG - totalB)) / (3 * pixels)
          : 0;

      let score = 50;
      score += Math.min(25, (contrast / 255) * 40);
      score += Math.min(15, (saturation / 255) * 30);
      if (avgLuma > 80 && avgLuma < 200) score += 10;
      score = Math.round(Math.min(100, Math.max(0, score)));

      const recs: string[] = [];
      if (contrast < 60) {
        recs.push("Increase contrast — your thumbnail blends into the background.");
      }
      if (avgLuma > 200) {
        recs.push("Too bright — reduce highlights so text stays readable.");
      } else if (avgLuma < 50) {
        recs.push("Too dark — details get lost on mobile screens.");
      }
      if (saturation < 30) {
        recs.push("Add bolder colors — muted thumbnails get skipped in search.");
      }
      if (recs.length === 0) {
        if (score >= 85) {
          recs.push("Excellent contrast and color balance!");
        } else {
          recs.push("Try adding a human face — faces create stronger visual connection.");
        }
      }

      resolve({ score, recommendations: recs.slice(0, 3) });
    };
    img.onerror = () => resolve({ score: 0, recommendations: ["Unable to analyze image."] });
    img.src = imageUrl;
  });
}

export default function ToolPage() {
  const [image, setImage] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [videoTitle, setVideoTitle] = useState("Your Amazing YouTube Video Title Here");
  const [channelName, setChannelName] = useState("Your Channel");
  const [viewCount, setViewCount] = useState("1.2M");
  const [uploadDate, setUploadDate] = useState("3 days ago");

  const [comp1Image, setComp1Image] = useState<string | null>(null);
  const [comp1Title, setComp1Title] = useState("Competitor Video Title — How They Did It");
  const [comp1Channel, setComp1Channel] = useState("Competitor Channel");
  const [comp1Views, setComp1Views] = useState("847K");
  const [comp1Date, setComp1Date] = useState("1 week ago");
  const [comp1Duration, setComp1Duration] = useState("15:32");

  const [comp2Image, setComp2Image] = useState<string | null>(null);
  const [comp2Title, setComp2Title] = useState("Another Competitor — The Full Breakdown");
  const [comp2Channel, setComp2Channel] = useState("Another Channel");
  const [comp2Views, setComp2Views] = useState("2.1M");
  const [comp2Date, setComp2Date] = useState("2 weeks ago");
  const [comp2Duration, setComp2Duration] = useState("10:12");

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  // NEW: Competitor scores
  const [comp1Score, setComp1Score] = useState<number | null>(null);
  const [comp1Recs, setComp1Recs] = useState<string[]>([]);
  const [comp2Score, setComp2Score] = useState<number | null>(null);
  const [comp2Recs, setComp2Recs] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const comp1InputRef = useRef<HTMLInputElement>(null);
  const comp2InputRef = useRef<HTMLInputElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkPro = async () => {
      const proEmail = localStorage.getItem("tr_pro_email");

      if (proEmail) {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("email", proEmail.toLowerCase())
          .eq("status", "active")
          .single();

        if (data && !error) {
          setIsPro(true);
          return;
        } else {
          localStorage.removeItem("thumbrank_pro");
          localStorage.removeItem("tr_pro_email");
        }
      }

      const proFlag = localStorage.getItem("thumbrank_pro");
      const licenseKey = localStorage.getItem("tr_license_key");
      if (proFlag === "true" && licenseKey) {
        const { data } = await supabase
          .from("licenses")
          .select("*")
          .eq("key", licenseKey)
          .eq("status", "active")
          .single();
        if (data) {
          setIsPro(true);
          setUser({ license: data });
        } else {
          localStorage.removeItem("thumbrank_pro");
          localStorage.removeItem("tr_license_key");
        }
      }
    };
    checkPro();
  }, []);

  const handleOwnImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    try {
      const dataUrl = await readFile(file);
      setImage(dataUrl);
      setError(null);
      setAiScore(null);
    } catch {
      setError("Failed to read image.");
    }
  }, []);

  const handleComp1Image = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try { setComp1Image(await readFile(file)); setComp1Score(null); } catch { /* ignore */ }
  }, []);

  const handleComp2Image = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try { setComp2Image(await readFile(file)); setComp2Score(null); } catch { /* ignore */ }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please drop an image file.");
      return;
    }
    try {
      const dataUrl = await readFile(file);
      setImage(dataUrl);
      setError(null);
      setAiScore(null);
    } catch {
      setError("Failed to read image.");
    }
  }, []);

  const handleRender = useCallback(async () => {
    if (!image) {
      setError("Please upload a thumbnail first.");
      return;
    }
    if (!isPro) {
      const PREVIEW_KEY = "tr_preview_count";
      const PREVIEW_DATE = "tr_preview_date";
      const LIMIT = 3;
      const today = new Date().toISOString().split("T")[0];
      const storedDate = localStorage.getItem(PREVIEW_DATE);
      let count = parseInt(localStorage.getItem(PREVIEW_KEY) || "0");
      if (storedDate !== today) { count = 0; localStorage.setItem(PREVIEW_DATE, today); }
      if (count >= LIMIT) {
        setError("Free limit reached: 3 previews per day. Upgrade to Pro for unlimited.");
        setLoading(false);
        setAnalyzing(false);
        return;
      }
      localStorage.setItem(PREVIEW_KEY, String(count + 1));
    }
    setLoading(true);
    setAnalyzing(true);

    try {
      // Analyze all three thumbnails
      const promises: Promise<AiAnalysis>[] = [analyzeThumbnail(image)];
      if (comp1Image) promises.push(analyzeThumbnail(comp1Image));
      if (comp2Image) promises.push(analyzeThumbnail(comp2Image));

      const results = await Promise.all(promises);

      setAiScore(results[0].score);
      setAiRecs(results[0].recommendations);

      if (results[1]) {
        setComp1Score(results[1].score);
        setComp1Recs(results[1].recommendations);
      }
      if (results[2]) {
        setComp2Score(results[2].score);
        setComp2Recs(results[2].recommendations);
      }
    } catch {
      setAiScore(null);
      setAiRecs([]);
    }
    setLoading(false);
    setAnalyzing(false);
  }, [image, comp1Image, comp2Image, isPro]);

  const handleExport = useCallback(async () => {
    if (!mockupRef.current) return;
    if (!isPro) {
      const PREVIEW_KEY = "tr_preview_count";
      const PREVIEW_DATE = "tr_preview_date";
      const LIMIT = 3;
      const today = new Date().toISOString().split("T")[0];
      const storedDate = localStorage.getItem(PREVIEW_DATE);
      let count = parseInt(localStorage.getItem(PREVIEW_KEY) || "0");
      if (storedDate !== today) { count = 0; localStorage.setItem(PREVIEW_DATE, today); }
      if (count >= LIMIT) {
        setError("You have used all 3 free previews today. Upgrade to Pro for unlimited previews.");
        return;
      }
    }
    setExporting(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      let watermarkEl: HTMLDivElement | null = null;
      if (!isPro && mockupRef.current) {
        watermarkEl = document.createElement("div");
        watermarkEl.textContent = "ThumbRank Preview";
        watermarkEl.style.cssText =
          "position:absolute;bottom:12px;right:12px;font-size:16px;font-weight:700;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,0.8);z-index:9999;pointer-events:none;font-family:Arial,sans-serif;";
        mockupRef.current.style.position = "relative";
        mockupRef.current.appendChild(watermarkEl);
      }
      const dataUrl = await toPng(mockupRef.current);
      if (watermarkEl && mockupRef.current) mockupRef.current.removeChild(watermarkEl);
      const link = document.createElement("a");
      link.download = `thumbrank-${keyword || "preview"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      if (!isPro) {
        const PREVIEW_KEY = "tr_preview_count";
        let count = parseInt(localStorage.getItem(PREVIEW_KEY) || "0");
        localStorage.setItem(PREVIEW_KEY, String(count + 1));
      }
    } catch (err) {
      console.error("Export failed:", err);
      setError("Failed to export PNG. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [isPro, keyword]);

  const scoreColor = (s: number) => {
    if (s >= 80) return "text-green-400";
    if (s >= 50) return "text-yellow-400";
    return "text-red-400";
  };
  const scoreRing = (s: number) => {
    if (s >= 80) return "stroke-green-400";
    if (s >= 50) return "stroke-yellow-400";
    return "stroke-red-400";
  };

  const renderVideoCard = (
    thumb: string | null, title: string, views: string, date: string,
    channel: string, duration: string, isOwn = false, score: number | null = null
  ) => (
    <div className={`flex gap-3 p-3 rounded-xl ${isOwn ? "border-2 border-purple-500 bg-[#1a1a2e]" : "bg-[#0f0f0f]"}`}>
      <div className="relative w-40 h-[90px] bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
        {thumb ? (
          <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-xs">No image</span>
        )}
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">{duration}</span>
        {isOwn && (
          <span className="absolute top-1 left-1 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">Your video</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">{views} views • {date}</p>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-[8px] text-white font-bold">{channel.charAt(0)}</div>
          <span className="text-xs text-gray-400">{channel}</span>
          <span className="text-gray-500">✓</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{title} — watch this video to learn more.</p>
        {score !== null && (
          <div className={`mt-1 text-xs font-bold ${scoreColor(score)}`}>Quality Score: {score}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      {/* REMOVED grid background — cleaner professional look */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-blue-900/20 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-pink-900/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <SiteNav />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Thumbnail Preview Tool</h1>
            <p className="text-gray-400">Upload your thumbnail, add competitors, and see how you look in a real YouTube search page.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Thumbnail</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-colors bg-[#111]/60 backdrop-blur-sm min-h-[180px] flex items-center justify-center"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleOwnImage} className="hidden" />
                  {image ? (
                    <div className="relative inline-block">
                      <img src={image} alt="Your thumbnail" className="max-h-40 mx-auto rounded-lg" />
                      <button
                        onClick={() => {
                          setImage(null);
                          setAiScore(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold leading-none"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400 mb-1">Drag & drop your thumbnail here</p>
                      <p className="text-gray-500 text-sm">or click to browse</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search keyword</label>
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. how to grow on youtube"
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a]/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 backdrop-blur-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Video title</label>
                  <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a]/80 border border-gray-700 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Channel name</label>
                  <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a]/80 border border-gray-700 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">View count</label>
                  <input type="text" value={viewCount} onChange={(e) => setViewCount(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a]/80 border border-gray-700 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload date</label>
                  <input type="text" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a]/80 border border-gray-700 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" />
                </div>
              </div>

              {/* Competitor 1 */}
              <div className="bg-[#111]/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <h3 className="font-semibold mb-3">Competitor 1</h3>
                <div onClick={() => comp1InputRef.current?.click()} className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors min-h-[100px] flex items-center justify-center mb-3 bg-[#0f0f0f]/50">
                  <input ref={comp1InputRef} type="file" accept="image/*" onChange={handleComp1Image} className="hidden" />
                  {comp1Image ? (
                    <div className="relative inline-block">
                      <img src={comp1Image} alt="Competitor 1" className="max-h-24 mx-auto rounded" />
                      <button
                        onClick={() => { setComp1Image(null); setComp1Score(null); }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold leading-none"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : <p className="text-gray-500 text-sm">Click or drag to upload<br/><span className="text-xs text-gray-600">PNG/JPG · max 5MB</span></p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={comp1Title} onChange={(e) => setComp1Title(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                  <input type="text" value={comp1Channel} onChange={(e) => setComp1Channel(e.target.value)} placeholder="Channel" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                  <input type="text" value={comp1Views} onChange={(e) => setComp1Views(e.target.value)} placeholder="Views" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                  <input type="text" value={comp1Duration} onChange={(e) => setComp1Duration(e.target.value)} placeholder="Duration" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
              </div>

              {/* Competitor 2 */}
              <div className="bg-[#111]/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <h3 className="font-semibold mb-3">Competitor 2</h3>
                <div onClick={() => comp2InputRef.current?.click()} className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors min-h-[100px] flex items-center justify-center mb-3 bg-[#0f0f0f]/50">
                  <input ref={comp2InputRef} type="file" accept="image/*" onChange={handleComp2Image} className="hidden" />
                  {comp2Image ? (
                    <div className="relative inline-block">
                      <img src={comp2Image} alt="Competitor 2" className="max-h-24 mx-auto rounded" />
                      <button
                        onClick={() => { setComp2Image(null); setComp2Score(null); }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold leading-none"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : <p className="text-gray-500 text-sm">Click or drag to upload<br/><span className="text-xs text-gray-600">PNG/JPG · max 5MB</span></p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={comp2Title} onChange={(e) => setComp2Title(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                  <input type="text" value={comp2Channel} onChange={(e) => setComp2Channel(e.target.value)} placeholder="Channel" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                  <input type="text" value={comp2Views} onChange={(e) => setComp2Views(e.target.value)} placeholder="Views" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                  <input type="text" value={comp2Duration} onChange={(e) => setComp2Duration(e.target.value)} placeholder="Duration" className="w-full px-3 py-2 rounded bg-[#1a1a1a]/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              <div className="flex gap-3 justify-end">
                <button onClick={handleRender} disabled={!image || loading || analyzing}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm flex items-center gap-2">
                  <span>✨</span>{loading || analyzing ? "Analyzing..." : "Render preview"}
                </button>
                <button onClick={handleExport} disabled={!image || exporting}
                  className="bg-[#1a1a1a]/80 hover:bg-[#2a2a2a] border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm flex items-center gap-2 backdrop-blur-sm">
                  <span>⬇</span>{exporting ? "Exporting..." : "Export PNG"}
                </button>
              </div>

              {error && <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>}
              {!isPro && (
                <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-200 px-4 py-3 rounded-lg text-sm">
                  Free plan: 3 previews per day. <Link href="/upgrade" className="underline font-semibold text-yellow-400">Upgrade to Pro</Link>
                </div>
              )}
              {isPro && (
                <div className="bg-green-900/30 border border-green-800 text-green-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <span className="text-green-400">✓</span> Pro Active — Unlimited previews
                </div>
              )}
              {!isPro && (
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-gray-300 font-medium">Already paid? Activate Pro:</p>
                  <div className="flex gap-2">
                    <input type="email" id="activateEmail" placeholder="Enter email used for payment" className="flex-1 px-3 py-2 rounded bg-[#111] border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                    <button onClick={async () => {
                      const email = (document.getElementById("activateEmail") as HTMLInputElement)?.value;
                      if (!email) return;
                      const { data } = await supabase.from("subscriptions").select("*").eq("email", email.toLowerCase()).eq("status", "active").single();
                      if (data) {
                        localStorage.setItem("thumbrank_pro", "true");
                        localStorage.setItem("tr_pro_email", email.toLowerCase());
                        setIsPro(true);
                        setError(null);
                        alert("Pro activated! Refresh the page if needed.");
                      } else {
                        setError("No active subscription found for this email.");
                      }
                    }} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors">Activate</button>
                  </div>
                </div>
              )}

              {/* YouTube Mockup */}
              <div ref={mockupRef} className="bg-[#0f0f0f] rounded-xl overflow-hidden border border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                  <div className="w-8 h-8 flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-red-600">
                      <path fill="currentColor" d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.81zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z" />
                    </svg>
                  </div>
                  <div className="flex-1 bg-[#1a1a1a] rounded-full px-4 py-2 text-sm text-gray-300 flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    {keyword || "how to grow on youtube"}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">U</div>
                </div>
                <div className="flex gap-1 px-4 py-2 border-b border-gray-800 overflow-x-auto">
                  {["All","Videos","Shorts","Channels","Playlists"].map((tab,i) => (
                    <button key={tab} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${i===0?"bg-white text-black":"text-gray-400 hover:text-white"}`}>{tab}</button>
                  ))}
                </div>
                <div className="p-4 space-y-3">
                  {renderVideoCard(image, videoTitle, viewCount, uploadDate, channelName, "12:45", true, aiScore)}
                  {renderVideoCard(comp1Image, comp1Title, comp1Views, comp1Date, comp1Channel, comp1Duration, false, comp1Score)}
                  {renderVideoCard(comp2Image, comp2Title, comp2Views, comp2Date, comp2Channel, comp2Duration, false, comp2Score)}
                </div>
              </div>

              {/* NEW: Comparison Panel */}
              {(aiScore !== null) && (comp1Score !== null || comp2Score !== null) && (
                <ComparisonPanel
                  main={image ? { score: aiScore, thumbnail: image, title: videoTitle } : null}
                  comp1={comp1Image && comp1Score !== null ? { score: comp1Score, thumbnail: comp1Image, title: comp1Title } : null}
                  comp2={comp2Image && comp2Score !== null ? { score: comp2Score, thumbnail: comp2Image, title: comp2Title } : null}
                />
              )}

              {/* AI Score Panel — RENAMED to Thumbnail Quality Score */}
              {aiScore !== null && (
                <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="stroke-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" />
                        <path className={scoreRing(aiScore)} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeDasharray={`${aiScore}, 100`} strokeLinecap="round" />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${scoreColor(aiScore)}`}>{aiScore}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Thumbnail Quality Score</h3>
                      <p className="text-sm text-gray-400">
                        {aiScore >= 80 ? "Strong thumbnail — likely to get clicks!" :
                         aiScore >= 50 ? "Decent, but improvements can boost CTR." :
                         "Needs work — low predicted click-through rate."}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {aiRecs.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-[#1a1a1a]/60 rounded-lg px-3 py-2">
                        <span className="text-purple-400 mt-0.5 flex-shrink-0">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isPro && (
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Upgrade to ThumbRank Pro</h2>
              <p className="text-gray-400 mb-6">Unlimited previews, no watermarks, and priority support.</p>
              <Link href="/upgrade" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">Get Pro — $15/month</Link>
            </div>
          )}

          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">FAQ</h2>
            <div className="space-y-4">
              <details className="bg-[#111]/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <summary className="font-semibold cursor-pointer">How many free previews do I get?</summary>
                <p className="text-gray-400 mt-2 text-sm">Free users get 3 previews per day. Upgrade to Pro for unlimited previews.</p>
              </details>
              <details className="bg-[#111]/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <summary className="font-semibold cursor-pointer">Do I need to sign up?</summary>
                <p className="text-gray-400 mt-2 text-sm">No. Just upload your thumbnail and see the preview instantly.</p>
              </details>
              <details className="bg-[#111]/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <summary className="font-semibold cursor-pointer">What do I get with Pro?</summary>
                <p className="text-gray-400 mt-2 text-sm">Unlimited previews, watermark-free PNG exports, Thumbnail Quality Score, and early access to new features.</p>
              </details>
            </div>
          </div>

          <footer className="mt-16 text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
            <p>© 2026 ThumbRank. Built for YouTube creators.</p>
          </footer>
        </div>

        <ExitIntentPopup />
      </div>
    </div>
  );
}
