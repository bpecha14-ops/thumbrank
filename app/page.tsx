"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, Zap, Check, ChevronDown, Mail,
  Eye, Users, TrendingUp, Lock, Star,
} from "lucide-react";

function AuroraBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030305]">
      <div className="aurora-1 absolute -top-[30%] -left-[10%] w-[120%] h-[120%] rounded-full opacity-50 blur-[160px]" />
      <div className="aurora-2 absolute top-[40%] -right-[10%] w-[100%] h-[100%] rounded-full opacity-30 blur-[120px]" />
      <div className="aurora-3 absolute -bottom-[20%] left-[20%] w-[110%] h-[110%] rounded-full opacity-40 blur-[140px]" />
      <style jsx>{`
        .aurora-1 { background: radial-gradient(circle, #6d28d9 0%, #4c1d95 30%, transparent 70%); animation: move1 10s ease-in-out infinite alternate; }
        .aurora-2 { background: radial-gradient(circle, #1e40af 0%, transparent 70%); animation: move2 12s ease-in-out infinite alternate; }
        .aurora-3 { background: radial-gradient(circle, #be185d 0%, transparent 70%); animation: move3 14s ease-in-out infinite alternate; }
        @keyframes move1 { from { transform: translate(0,0) scale(1); } to { transform: translate(50px,-40px) scale(1.12); } }
        @keyframes move2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-40px,30px) scale(1.15); } }
        @keyframes move3 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,50px) scale(1.08); } }
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
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/tool" className="hover:text-white transition-colors">Free Tool</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/tool" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">Try Free</Link>
          <Link href="/tool" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition-all">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-12 lg:pt-40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-6">
          <Zap className="w-3 h-3 text-purple-400" />
          Now with AI-powered competitor comparison
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
          Stop guessing.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Start ranking.</span>
        </h1>
        <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-2xl mx-auto">
          ThumbRank helps YouTube creators see how their thumbnails look against real competitor search results without burning early views on guesswork.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/tool" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-900/20">
            Try Free — No signup <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/#pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all">
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

function MockupSection() {
  const { ref, style, onMove, onLeave } = useTilt();
  return (
    <section className="pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div ref={ref} style={style} onMouseMove={onMove} onMouseLeave={onLeave}
          className="relative rounded-2xl border border-white/10 bg-[#0f0f0f] overflow-hidden shadow-2xl shadow-purple-900/10"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="ml-auto text-[10px] text-white/30">youtube.com/results</div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.81zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z"/></svg>
            </div>
            <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm text-white/60">
              <span className="text-white/30">🔍</span> how to grow on youtube
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">U</div>
          </div>
          <div className="flex gap-1 px-4 py-2 border-b border-white/5 text-xs text-white/50">
            {["All","Videos","Shorts","Channels","Playlists"].map((t,i) => (
              <span key={t} className={`px-3 py-1 rounded-full ${i===0?"bg-white text-black font-medium":"hover:bg-white/5"}`}>{t}</span>
            ))}
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-3 rounded-xl p-3 border border-purple-500/30 bg-purple-500/5">
              <div className="w-32 h-20 rounded-lg bg-purple-500/20 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">YOUR VIDEO</div>
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">12:45</div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm text-white font-medium truncate">How I Grew My Channel to 50K in 90 Days</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 rounded-full bg-white/10" />
                  <span className="text-xs text-white/50">Your Channel</span>
                  <span className="text-purple-400 text-xs">✓</span>
                </div>
                <div className="text-xs text-white/40 mt-1">1.2M views · 3 days ago</div>
                <div className="text-xs text-white/30 mt-1 truncate">The exact thumbnail strategy that changed everything...</div>
                <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                  <Star className="w-3 h-3" /> AI Score: 88
                </div>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl p-3 border border-white/5">
              <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">No image</div>
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">15:32</div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm text-white font-medium truncate">Competitor Video Title — How They Did It</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 rounded-full bg-white/10" />
                  <span className="text-xs text-white/50">Competitor Channel</span>
                  <span className="text-purple-400 text-xs">✓</span>
                </div>
                <div className="text-xs text-white/40 mt-1">847K views · 1 week ago</div>
                <div className="text-xs text-white/30 mt-1 truncate">Learn the secrets behind viral thumbnails...</div>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl p-3 border border-white/5">
              <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">No image</div>
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">10:12</div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm text-white font-medium truncate">Another Competitor — The Full Breakdown</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 rounded-full bg-white/10" />
                  <span className="text-xs text-white/50">Another Channel</span>
                  <span className="text-purple-400 text-xs">✓</span>
                </div>
                <div className="text-xs text-white/40 mt-1">2.1M views · 2 weeks ago</div>
                <div className="text-xs text-white/30 mt-1 truncate">Watch this video to learn more.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
   const stats = [
    { label: "AI-powered analysis", value: "100%", icon: Eye },
    { label: "Privacy first", value: "0 KB", icon: Lock },
    { label: "YouTube creators", value: "For", icon: Users },
    { label: "Real competitor preview", value: "Live", icon: TrendingUp },
  ];
  return (
    <section className="py-12 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-white/40 flex items-center justify-center gap-1.5">
                <s.icon className="w-3.5 h-3.5" /> {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "Real Search Preview", desc: "See exactly how your thumbnail looks on a phone screen surrounded by real competitors.", icon: "🔍", span: "md:col-span-2" },
    { title: "AI Thumbnail Score", desc: "Get an instant quality score based on contrast, composition, and clutter analysis.", icon: "⚡", span: "" },
    { title: "Competitor Compare", desc: "Upload up to 2 competitor thumbnails and see which one wins the scroll.", icon: "🏆", span: "" },
    { title: "Privacy First", desc: "All processing happens in your browser. Zero server uploads. Your thumbnails never leave your device.", icon: "🔒", span: "md:col-span-2" },
  ];
  return (
    <section id="features" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to win the scroll</h2>
          <p className="text-white/50">No more guessing. Preview, score, and compare before you publish.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <TiltCard key={i} className={`group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors ${f.span}`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function MakerStory() {
  return (
    <section className="py-24 border-y border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Why I built ThumbRank</h2>
        <div className="text-lg text-white/60 leading-relaxed space-y-6">
          <p>
            I spent 3 years growing a YouTube channel from 0 to 50K subscribers. The one thing that moved the needle every single time?{" "}
            <span className="text-white font-medium">The thumbnail.</span> Not the title. Not the tags. The thumbnail.
          </p>
          <p>
            But every thumbnail looks perfect in Photoshop and terrible on a phone screen next to 10 competitors. I built ThumbRank to solve that.
          </p>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const items = [
    { name: "Alex", role: "Gaming Creator", text: "Finally a tool that shows the real picture. My CTR went up after I started previewing thumbnails here first." },
    { name: "Sarah", role: "Tech Reviewer", text: "The AI score is surprisingly accurate. Caught a cluttered design I was about to ship." },
    { name: "Marcus", role: "Fitness Coach", text: "Zero uploads to server = peace of mind. The competitor comparison is a game changer." },
    { name: "Jenny", role: "Vlogger", text: "I use this before every upload now. Takes 30 seconds, saves me from bad thumbnails." },
    { name: "David", role: "Educator", text: "Simple, fast, and actually useful. The free tier is generous enough for my workflow." },
  ];
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">Loved by creators</h2>
        <p className="text-white/50 text-center">Join thousands who preview before they publish.</p>
      </div>
      <div className="relative">
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {[...items, ...items].map((t, i) => (
            <div key={i} className="inline-block w-[320px] flex-shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-5 whitespace-normal">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">{t.name[0]}</div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 30s linear infinite; }
        `}</style>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-24 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple pricing</h2>
          <p className="text-white/50">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-lg font-semibold text-white mb-2">Free</h3>
            <div className="text-4xl font-bold text-white mb-6">$0</div>
            <ul className="space-y-3 mb-8">
              {["3 previews per day", "Basic AI Thumbnail Score", "1 competitor slot", "PNG export with watermark"].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="w-4 h-4 text-purple-400" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/tool" className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-center hover:bg-white/10 transition-all">
              Get started free
            </Link>
          </TiltCard>
          <TiltCard className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-transparent p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-semibold text-white">
              Most popular
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
            <div className="text-4xl font-bold text-white mb-1">$20</div>
<div className="text-sm text-white/40 mb-6">/month — cancel anytime</div>
            <ul className="space-y-3 mb-8">
              {["Unlimited previews", "Full AI Thumbnail Score + breakdown", "2 competitor slots", "PNG export — no watermark", "Priority support"].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="w-4 h-4 text-purple-400" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/upgrade" className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center hover:opacity-90 transition-all shadow-lg shadow-purple-900/20">
              Upgrade to Pro
            </Link>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

function EmailCapture() {
  return (
    <section className="py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <Mail className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Get early access to new features</h3>
          <p className="text-white/50 mb-6 text-sm">Join creators getting thumbnail tips weekly. No spam.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
              const email = input.value;
              if (!email.includes("@")) return;
              const list = JSON.parse(localStorage.getItem("tr_emails") || "[]");
              list.push({ email, date: new Date().toISOString() });
              localStorage.setItem("tr_emails", JSON.stringify(list));
              input.value = "";
              const btn = e.currentTarget.querySelector("button");
              if (btn) { btn.textContent = "You're on the list!"; (btn as HTMLButtonElement).disabled = true; }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input name="email" type="email" required placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 backdrop-blur-sm" />
            <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "How does the AI Thumbnail Score work?", a: "We analyze your thumbnail directly in your browser using computer vision — measuring contrast, brightness variance, edge clutter, and visual hierarchy. No image ever leaves your device." },
    { q: "Is my thumbnail uploaded to a server?", a: "No. All processing happens locally in your browser using the Canvas API. We literally cannot see your images — zero server-side storage." },
    { q: "What's the difference between Free and Pro?", a: "Free gives you 3 previews per day with basic scoring and watermarked exports. Pro unlocks unlimited previews, full competitor comparison, detailed breakdowns, and clean exports." },
    { q: "Can I compare my thumbnail with competitors?", a: "Yes. Upload up to 2 competitor thumbnails alongside yours, render a realistic YouTube search results page, and see which one wins the scroll." },
    { q: "Does this work on mobile?", a: "The preview tool works best on desktop, but the rendered mockups show exactly how your thumbnail will look on a mobile screen — which is the whole point." },
   { q: "Can I cancel anytime?", a: "Yes. Monthly subscription, cancel whenever you want. No hidden fees, no lock-in." },
  ];
  return (
    <section id="faq" className="py-24 border-y border-white/5">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-white">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to stop guessing?</h2>
        <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
          Preview your thumbnail against real competitors in seconds. No signup required.
        </p>
        <Link href="/tool" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-purple-900/20">
          Try ThumbRank free <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-white text-sm">ThumbRank</span>
        </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
    <Link href="/tool" className="hover:text-white transition-colors">Free Tool</Link>
    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
    <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
  </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen text-white selection:bg-purple-500/30">
      <AuroraBg />
      <Noise />
      <SpotlightCursor />
      <Navbar />
      <HeroSection />
      <MockupSection />
      <StatsSection />
      <FeaturesSection />
      <MakerStory />
      <TestimonialsSection />
      <PricingSection />
      <EmailCapture />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
