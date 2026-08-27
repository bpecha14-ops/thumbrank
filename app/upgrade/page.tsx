"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Check, ArrowLeft } from "lucide-react";


const PADDLE_CLIENT_TOKEN = "live_4d1fad2bccb272396ab44e6f949";

const PRICE_MONTHLY = "pri_01m1288thzjkq2ektkvvblj0gp";
const PRICE_YEARLY = "pri_01m128f8qzsdwphbxcqg35785e";

// Для TypeScript — чтобы не ругался на window.Paddle
declare global {
  interface Window {
    Paddle?: any;
  }
}

function AuroraBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030305]">
      <div className="aurora-1 absolute -top-[40%] -left-[20%] w-[140%] h-[140%] rounded-full opacity-50 blur-[140px]" />
      <div className="aurora-2 absolute top-[20%] -right-[20%] w-[120%] h-[120%] rounded-full opacity-35 blur-[120px]" />
      <style jsx>{`
        .aurora-1 { background: radial-gradient(circle, #6d28d9 0%, #4c1d95 30%, transparent 70%); animation: move1 10s ease-in-out infinite alternate; }
        .aurora-2 { background: radial-gradient(circle, #1e40af 0%, transparent 70%); animation: move2 12s ease-in-out infinite alternate; }
        @keyframes move1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,-40px) scale(1.15); } }
        @keyframes move2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-50px,30px) scale(1.2); } }
      `}</style>
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
        <div className="flex items-center gap-3">
          <Link href="/tool" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
            Try Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function UpgradePage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Paddle) {
      window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
      setPaddleLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
        setPaddleLoaded(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  const freeFeatures = [
    "3 previews per day",
    "Basic AI Thumbnail Score",
    "1 competitor slot",
    "PNG export with watermark",
  ];

  const proFeatures = [
    "Unlimited previews",
    "Full AI Thumbnail Score + breakdown",
    "2 competitor slots",
    "PNG export — no watermark",
    "Priority support",
  ];

  return (
    <main className="min-h-screen text-white selection:bg-purple-500/30">
      <AuroraBg />
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ThumbRank Pro</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Get unlimited thumbnail previews, watermark-free exports, AI Thumbnail analysis, and priority support.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billing === "yearly" ? "bg-white text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            Yearly
          </button>
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "bg-white text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            Monthly
          </button>
          {billing === "yearly" && (
            <span className="text-xs text-emerald-400 font-medium">BEST VALUE</span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-lg font-semibold text-white mb-2">Free</h3>
            <div className="text-4xl font-bold text-white mb-1">$0</div>
            <div className="text-sm text-white/40 mb-6">Forever free</div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="w-4 h-4 text-white/30" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/tool" className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-center hover:bg-white/10 transition-all">
              Continue with Free
            </Link>
          </div>

          <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-transparent p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-semibold text-white">
              Most popular
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">{billing === "monthly" ? "$20" : "$16"}</span>
              <span className="text-sm text-white/40">/month</span>
            </div>
            {billing === "yearly" && (
              <span className="inline-block text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full mb-2">
                Save $48/year
              </span>
            )}
            <div className="text-sm text-white/40 mb-6">
              {billing === "yearly" ? "Billed yearly" : "Cancel anytime"}
            </div>
            <ul className="space-y-3 mb-8">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="w-4 h-4 text-purple-400" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                if (!window.Paddle) return;
                const priceId = billing === "monthly" ? PRICE_MONTHLY : PRICE_YEARLY;
                window.Paddle.Checkout.open({
                  items: [{ priceId, quantity: 1 }]
                });
              }}
              disabled={!paddleLoaded}
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center hover:opacity-90 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {billing === "monthly" ? "Get Pro — $20/month" : "Get Pro — $16/month"}
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/tool" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to the tool
          </Link>
        </div>
      </div>
    </main>
  );
}
