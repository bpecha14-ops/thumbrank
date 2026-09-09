"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Check, ArrowLeft, Zap, Bell, RefreshCw, Fingerprint, Users } from "lucide-react";

const PADDLE_CLIENT_TOKEN = "live_4d1fad2bccb272396ab44e6f949";
const PRICE_CREATOR_OS = "pri_01m23m3xek84dzjjvrhevywj0r";

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
        .aurora-1 { background: radial-gradient(circle, #be185d 0%, #4c1d95 30%, transparent 70%); animation: move1 10s ease-in-out infinite alternate; }
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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">ThumbRank</span>
        </Link>
        <Link href="/tool" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
          Try Free
        </Link>
      </div>
    </nav>
  );
}

const features = [
  {
    icon: Zap,
    title: "CTR Calibration & Prediction Loop",
    desc: "ThumbRank learns which scores actually predict YOUR channel's CTR. Every upload makes the next prediction sharper.",
  },
  {
    icon: Bell,
    title: "CTR Drop Alarm",
    desc: "Video underperforming 48h after publish? Get alerted while there's still time to swap the thumbnail — not two weeks later.",
  },
  {
    icon: RefreshCw,
    title: "Weekly Rescue Scanner",
    desc: "Every week we scan your catalog and flag videos whose thumbnails are costing you impressions. Fix the leaks automatically.",
  },
  {
    icon: Fingerprint,
    title: "Packaging Fingerprint + History",
    desc: "Track how your packaging style evolves over time and how each change correlates with views.",
  },
  {
    icon: Users,
    title: "10 Competitor Channels",
    desc: "Watch up to 10 competitors. Full outlier detection, digest and comparison — not just 2 slots.",
  },
];

export default function CreatorOsPage() {
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

  const proFeatures = [
    "Unlimited previews",
    "Full AI Thumbnail Score + breakdown",
    "PNG export — no watermark",
    "Priority support",
  ];

  return (
    <main className="min-h-screen text-white selection:bg-pink-500/30">
      <AuroraBg />
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-6">
            <Sparkles className="w-3 h-3 text-pink-400" />
            The full growth system for serious creators
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Stop reacting to CTR drops.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Predict them.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-8">
            Pro tells you how a thumbnail looks. Creator OS watches your whole channel,
            learns what works for your audience, and warns you before views leak.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                if (!window.Paddle) return;
                window.Paddle.Checkout.open({ items: [{ priceId: PRICE_CREATOR_OS, quantity: 1 }] });
              }}
              disabled={!paddleLoaded}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Creator OS — $49/month
            </button>
            <span className="text-sm text-white/40">Cancel anytime</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-pink-500/40">
              <f.icon className="w-6 h-6 text-pink-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-pink-500/40">
            <Sparkles className="w-6 h-6 text-pink-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Everything in Pro</h3>
            <ul className="space-y-2">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/50">
                  <Check className="w-4 h-4 text-pink-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Price anchor */}
        <div className="relative rounded-2xl border border-pink-500/30 bg-gradient-to-b from-pink-500/[0.07] to-transparent p-8 text-center max-w-2xl mx-auto">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-xs font-bold text-white">
            BEST VALUE
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold text-white">$49</span>
            <span className="text-white/40">/month</span>
          </div>
          <p className="text-sm text-white/50 mb-6">One rescued video pays for months of Creator OS.</p>
          <button
            onClick={() => {
              if (!window.Paddle) return;
              window.Paddle.Checkout.open({ items: [{ priceId: PRICE_CREATOR_OS, quantity: 1 }] });
            }}
            disabled={!paddleLoaded}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upgrade to Creator OS
          </button>
          <p className="text-xs text-white/30 mt-4">Prefer to start small? <Link href="/upgrade" className="text-pink-400 hover:underline">Get Pro for $20/mo</Link></p>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
