"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Check, ArrowLeft, Download, Star, Gift } from "lucide-react";

const PADDLE_CLIENT_TOKEN = "live_4d1fad2bccb272396ab44e6f949";
const PRICE_TEMPLATES = "pri_01m23w745hyra4af4qebtegkh7";

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

const whatsInside = [
  "20+ battle-tested thumbnail templates (curiosity, listicles, before/after, mistakes, transformations)",
  "New templates added every week — free",
  "High-res PNG, 1280×720 — drop into any editor",
  "README: which template to use for which video type",
  "Instant download after payment",
  "Lifetime access — buy once, get every future template",
];

const steps = [
  { n: "1", t: "Pick a template", d: "Match your video type: curiosity hook, listicle, mistake-callout, transformation story." },
  { n: "2", t: "Drop your face/title", d: "Open any editor — Canva, Photoshop, even Paint. Swap the placeholder text and image." },
  { n: "3", t: "Score it in ThumbRank", d: "Paste your version into thumbrankpro.com/tool and check the AI Score before you publish." },
];

export default function TemplatesPage() {
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

  return (
    <main className="min-h-screen text-white selection:bg-pink-500/30">
      <AuroraBg />
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-6">
            <Gift className="w-3 h-3 text-pink-400" />
            Digital download · lifetime updates
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            The Thumbnail
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">System</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-4">
            20+ proven YouTube thumbnail templates with a system for using them.
            Not a random pack — every template is built around a psychological hook that makes people stop scrolling.
          </p>
          <p className="text-sm text-pink-300/80 mb-8">New templates every week. Buy once — every future template is free.</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                if (!window.Paddle) return;
                window.Paddle.Checkout.open({ items: [{ priceId: PRICE_TEMPLATES, quantity: 1 }] });
              }}
              disabled={!paddleLoaded}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" /> Get it — $47
            </button>
            <span className="text-sm text-white/40">One-time payment · no subscription</span>
          </div>
        </div>

        {/* What's inside */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-pink-400" /> What you get
          </h2>
          <ul className="space-y-3">
            {whatsInside.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <Check className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* How it works */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-3xl font-bold text-pink-500/60 mb-2">{s.n}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.t}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="relative rounded-2xl border border-pink-500/30 bg-gradient-to-b from-pink-500/[0.07] to-transparent p-8 text-center">
          <div className="text-4xl font-bold text-white mb-1">$47 <span className="text-lg text-white/40 font-normal">one-time</span></div>
          <p className="text-sm text-white/50 mb-6">Less than the cost of one video that flops because of a bad thumbnail.</p>
          <button
            onClick={() => {
              if (!window.Paddle) return;
              window.Paddle.Checkout.open({ items: [{ priceId: PRICE_TEMPLATES, quantity: 1 }] });
            }}
            disabled={!paddleLoaded}
            className="w-full max-w-md py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 inline mr-1" /> Get The Thumbnail System
          </button>
          <p className="text-xs text-white/30 mt-4">Instant download · secure checkout by Paddle · questions? bpecha14@gmail.com</p>
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
