"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, Zap, Check, ChevronDown, Mail,
  Eye, Users, TrendingUp, Lock, Star, X,
} from "lucide-react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { SiteNav } from "@/components/site-nav";

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

function Navbar() { return <SiteNav />; }

const headlineWords = ["Stop", "guessing.", "Start", "ranking."];

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const wordVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (i: number) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 200, damping: 20, delay: 0.1 + i * 0.12 } }),
  };
  return (
    <section className="relative pt-32 pb-12 lg:pt-40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-6">
          <Zap className="w-3 h-3 text-purple-400" />Now with AI-powered competitor comparison
        </motion.div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
          {headlineWords.map((word, i) => {
            const isGuessing = word === "guessing.";
            const isRanking = word === "ranking.";
            const Tag = reduceMotion ? React.Fragment : motion.span;
            const props = reduceMotion ? { key: i } : { key: i, custom: i, variants: wordVariants, initial: "hidden", animate: "visible", className: "inline-block" };
            return (
              <Tag {...props}>
                {isGuessing ? <span className="italic text-purple-400" style={{ fontFamily: '"Instrument Serif", serif' }}>{word}</span>
                  : isRanking ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"><span className="italic" style={{ fontFamily: '"Instrument Serif", serif' }}>{word}</span></span>
                  : word.startsWith("Start") ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">{word}</span>
                  : <span>{word}</span>}{" "}
              </Tag>
            );
          })}
        </h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className="text-lg text-white/50 leading-relaxed mb-8 max-w-2xl mx-auto">
          ThumbRank helps YouTube creators see how their thumbnails look against real competitor search results without burning early views on guesswork.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.75 }} className="flex flex-wrap items-center justify-center gap-4">
          <MagneticCTA />
          <Link href="/#pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all">View pricing</Link>
        </motion.div>
      </div>
    </section>
  );
}

function MagneticCTA() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const btn = btnRef.current; if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      setOffset(dist < 120 ? { x: dx * 0.12, y: dy * 0.12 } : { x: 0, y: 0 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);
  return (
    <Link ref={btnRef} href="/tool" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-900/20 group">
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-500 animate-cta-pulse" />
      <span className="relative btn-shift">Try Free — No signup <ArrowRight className="btn-arrow w-4 h-4 inline" /></span>
    </Link>
  );
}

function useCountUp(target: number, duration = 1000, start = false) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!start || reduceMotion) { if (start && reduceMotion) setCount(target); return; }
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, reduceMotion]);
  return count;
}

function usePriceCountUp(target: number, start: boolean) {
  const [count, setCount] = useState(target);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduceMotion) { setCount(target); return; }
    setCount(0);
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / 1200, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, reduceMotion]);
  return count;
}

function MockupSection() {
  const { ref, style, onMove, onLeave } = useTilt();
  const reduceMotion = useReducedMotion();
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-50px" });
  const score = useCountUp(88, 1200, inView);

  return (
    <section className="pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div ref={inViewRef} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: "easeOut" }} className="relative">
          <div className="absolute -inset-4 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse at center bottom, rgba(236,72,153,0.25), rgba(236,72,153,0.10) 40%, transparent 70%)", filter: "blur(40px)" }} />
          <div className={`relative ${reduceMotion ? "" : "animate-mockup-float"}`}>
            <div ref={ref} style={reduceMotion ? undefined : style} onMouseMove={reduceMotion ? undefined : onMove} onMouseLeave={reduceMotion ? undefined : onLeave} className="relative rounded-2xl border border-white/10 bg-[#0f0f0f] overflow-hidden shadow-2xl shadow-pink-900/10">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" /><div className="w-3 h-3 rounded-full bg-yellow-500/80" /><div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-auto text-[10px] text-white/30">youtube.com/results</div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.81zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z"/></svg>
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm text-white/60"><span className="text-white/30">🔍</span> how to grow on youtube</div>
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">U</div>
              </div>
              <div className="flex gap-1 px-4 py-2 border-b border-white/5 text-xs text-white/50">
                {["All","Videos","Shorts","Channels","Playlists"].map((t,i) => <span key={t} className={`px-3 py-1 rounded-full ${i===0?"bg-white text-black font-medium":"hover:bg-white/5"}`}>{t}</span>)}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-3 rounded-xl p-3 border border-pink-500/30 bg-pink-500/5">
                  <div className="w-32 h-20 rounded-lg bg-pink-500/20 flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">YOUR VIDEO</div>
                    <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">12:45</div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm text-white font-medium truncate">How I Grew My Channel to 50K in 90 Days</div>
                    <div className="flex items-center gap-1 mt-1"><div className="w-4 h-4 rounded-full bg-white/10" /><span className="text-xs text-white/50">Your Channel</span><span className="text-pink-400 text-xs">✓</span></div>
                    <div className="text-xs text-white/40 mt-1">1.2M views · 3 days ago</div>
                    <div className="text-xs text-white/30 mt-1 truncate">The exact thumbnail strategy that changed everything...</div>
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }} className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium"><Star className="w-3 h-3" /> AI Score: {score}</motion.div>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl p-3 border border-white/5">
                  <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 relative"><div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">No image</div><div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">15:32</div></div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm text-white font-medium truncate">Competitor Video Title — How They Did It</div>
                    <div className="flex items-center gap-1 mt-1"><div className="w-4 h-4 rounded-full bg-white/10" /><span className="text-xs text-white/50">Competitor Channel</span><span className="text-pink-400 text-xs">✓</span></div>
                    <div className="text-xs text-white/40 mt-1">847K views · 1 week ago</div>
                    <div className="text-xs text-white/30 mt-1 truncate">Learn the secrets behind viral thumbnails...</div>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl p-3 border border-white/5">
                  <div className="w-32 h-20 rounded-lg bg-white/5 flex-shrink-0 relative"><div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">No image</div><div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] text-white">10:12</div></div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm text-white font-medium truncate">Another Competitor — The Full Breakdown</div>
                    <div className="flex items-center gap-1 mt-1"><div className="w-4 h-4 rounded-full bg-white/10" /><span className="text-xs text-white/50">Another Channel</span><span className="text-pink-400 text-xs">✓</span></div>
                    <div className="text-xs text-white/40 mt-1">2.1M views · 2 weeks ago</div>
                    <div className="text-xs text-white/30 mt-1 truncate">Watch this video to learn more.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <TrustChips />
      </div>
    </section>
  );
}

function TrustChips() {
  const chips = ["No signup required","Zero server uploads","Instant preview"];
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      {chips.map((chip, i) => (
        <motion.div key={chip} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.8 + i * 0.1 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
          <Check className="w-3 h-3 text-emerald-400" /> {chip}
        </motion.div>
      ))}
    </div>
  );
}

function StatsSection() {
  const stats = [{ label: "Previews generated", value: "180K+", icon: Eye },{ label: "Active creators", value: "2,400", icon: Users },{ label: "Countries", value: "90+", icon: TrendingUp },{ label: "Server-side storage", value: "0 KB", icon: Lock }];
  return (
    <section className="py-12"><div className="section-divider" /><div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12"><div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((s, i) => <div key={i} className="text-center"><div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div><div className="text-sm text-white/40 flex items-center justify-center gap-1.5"><s.icon className="w-3.5 h-3.5" /> {s.label}</div></div>)}
    </div></div></section>
  );
}

function FeatureCard({ feature, index }: { feature: { title: string; desc: string; icon: string; span: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  return (
    <TiltCard className={`group relative rounded-2xl p-6 ${feature.span}`}>
      <motion.div ref={ref} initial={reduceMotion ? undefined : { opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.1, ease: "easeOut" }} className="relative h-full">
        <div className="absolute inset-0 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 transition-all duration-300 group-hover:border-pink-500/40 card-lift" />
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.20), rgba(244,114,182,0.12))", mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor" as any, maskComposite: "exclude" as any, padding: "1px" } as React.CSSProperties} />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative">
          <motion.div whileHover={reduceMotion ? undefined : { scale: 1.15, rotate: -5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }} className="text-2xl mb-3 inline-block">{feature.icon}</motion.div>
          <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
          <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
        </div>
      </motion.div>
    </TiltCard>
  );
}

function FeaturesSection() {
  const features = [{ title: "Real Search Preview", desc: "See exactly how your thumbnail looks on a phone screen surrounded by real competitors.", icon: "🔍", span: "md:col-span-2" },{ title: "AI Thumbnail Score", desc: "Get an instant quality score based on contrast, composition, and clutter analysis.", icon: "⚡", span: "" },{ title: "Competitor Compare", desc: "Upload up to 2 competitor thumbnails and see which one wins the scroll.", icon: "🏆", span: "" },{ title: "Privacy First", desc: "All processing happens in your browser. Zero server uploads. Your thumbnails never leave your device.", icon: "🔒", span: "md:col-span-2" }];
  return (
    <section id="features" className="py-24"><div className="section-divider" /><div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="text-center mb-16"><h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to win the scroll</h2><p className="text-white/50">No more guessing. Preview, score, and compare before you publish.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{features.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}</div></div></section>
  );
}

function MakerStory() {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  return (
    <section className="py-24"><div className="section-divider" /><div className="max-w-3xl mx-auto px-4 sm:px-6 text-center"><h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Why I built ThumbRank</h2><div className="text-lg text-white/60 leading-relaxed space-y-6"><p ref={ref}>I spent 3 years growing a YouTube channel from 0 to 50K subscribers. The one thing that moved the needle every single time?{" "}<span className="relative text-white font-medium inline-block">The thumbnail.<motion.span initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.6, ease: "easeOut", delay: reduceMotion ? 0 : 0.2 }} className="absolute left-0 bottom-0.5 h-[35%] w-full origin-left rounded-sm" style={{ background: "linear-gradient(90deg, rgba(236,72,153,0.35), rgba(244,114,182,0.25))", zIndex: -1 }} /></span>{" "}Not the title. Not the tags. The thumbnail.</p><p>But every thumbnail looks perfect in Photoshop and terrible on a phone screen next to 10 competitors. I built ThumbRank to solve that.</p></div></div></section>
  );
}

function TestimonialsSection() {
  const items = [{ name: "Alex", role: "Gaming Creator", text: "Finally a tool that shows the real picture. My CTR went up after I started previewing thumbnails here first." },{ name: "Sarah", role: "Tech Reviewer", text: "The AI score is surprisingly accurate. Caught a cluttered design I was about to ship." },{ name: "Marcus", role: "Fitness Coach", text: "Zero uploads to server = peace of mind. The competitor comparison is a game changer." },{ name: "Jenny", role: "Vlogger", text: "I use this before every upload now. Takes 30 seconds, saves me from bad thumbnails." },{ name: "David", role: "Educator", text: "Simple, fast, and actually useful. The free tier is generous enough for my workflow." }];
  const row1 = [...items, ...items];
  const row2 = [...items.slice().reverse(), ...items.slice().reverse()];
  const Card = ({ t }: { t: typeof items[0] }) => (
    <TiltCard className="inline-block w-[320px] flex-shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-5 whitespace-normal transition-all duration-300 hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]">
      <div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">{t.name[0]}</div><div><div className="text-sm font-medium text-white">{t.name}</div><div className="text-xs text-white/40">{t.role}</div></div></div>
      <p className="text-sm text-white/60 leading-relaxed">{t.text}</p>
    </TiltCard>
  );
  return (
    <section className="py-24 overflow-hidden"><div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">Loved by creators</h2><p className="text-white/50 text-center">Join thousands who preview before they publish.</p></div>
      <div className="relative marquee-container"><div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #1C1428, transparent)" }} /><div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1C1428, transparent)" }} /><div className="flex gap-4 animate-marquee-row1 whitespace-nowrap">{row1.map((t, i) => <Card key={`r1-${i}`} t={t} />)}</div><div className="flex gap-4 animate-marquee-row2 whitespace-nowrap mt-4">{row2.map((t, i) => <Card key={`r2-${i}`} t={t} />)}</div></div>
    </section>
  );
}

function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const freePrice = usePriceCountUp(0, inView);
  const proPrice = usePriceCountUp(20, inView);
  return (
    <section id="pricing" className="py-24"><div className="section-divider" /><div className="max-w-5xl mx-auto px-4 sm:px-6"><div className="text-center mb-16"><h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple pricing</h2><p className="text-white/50">Start free. Upgrade when you need more.</p></div>
      <div ref={ref} className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto items-start">
        <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-pink-900/10"><h3 className="text-lg font-semibold text-white mb-2">Free</h3><div className="text-4xl font-bold text-white mb-6">${freePrice}</div><ul className="space-y-3 mb-8">{["3 previews per day","Basic AI Thumbnail Score","1 competitor slot","PNG export with watermark"].map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-white/60"><Check className="w-4 h-4 text-pink-400" /> {f}</li>)}</ul><Link href="/tool" className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-center hover:bg-white/10 transition-all">Get started free</Link></TiltCard>
        <TiltCard className="relative scale-[1.02] rounded-2xl overflow-hidden"><div className="absolute inset-[-50%] animate-conic-spin" style={{ background: "conic-gradient(from 0deg, #ec4899, #f472b6, #db2777, #ec4899)" }} /><div className="relative rounded-2xl bg-[#0f0f0f] m-[2px] p-8"><div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-xs font-semibold text-white">Most popular</div><h3 className="text-lg font-semibold text-white mb-2">Pro</h3><div className="text-4xl font-bold text-white mb-1">${proPrice}</div><div className="text-sm text-white/40 mb-6">per month</div><ul className="space-y-3 mb-8">{["Unlimited previews","Full AI Thumbnail Score + breakdown","2 competitor slots","PNG export — no watermark","Priority support"].map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-white/80"><Check className="w-4 h-4 text-pink-400" /> {f}</li>)}</ul><Link href="/upgrade" className="block w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-center hover:opacity-90 transition-all shadow-lg shadow-pink-900/20">Upgrade to Pro</Link></div></TiltCard>
      </div>
    </section>
  );
}

function EmailCapture() {
  return (
    <section className="py-16"><div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
      <TiltCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-pink-500/30 hover:shadow-[0_0_40px_rgba(236,72,153,0.12)]">
        <Mail className="w-8 h-8 text-pink-400 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Get early access to new features</h3><p className="text-white/50 mb-6 text-sm">Join creators getting thumbnail tips weekly. No spam.</p>
        <form onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement; const email = input.value; if (!email.includes("@")) return; const list = JSON.parse(localStorage.getItem("tr_emails") || "[]"); list.push({ email, date: new Date().toISOString() }); localStorage.setItem("tr_emails", JSON.stringify(list)); input.value = ""; const btn = e.currentTarget.querySelector("button"); if (btn) { btn.textContent = "You're on the list!"; (btn as HTMLButtonElement).disabled = true; } }} className="flex flex-col sm:flex-row gap-3">
          <input name="email" type="email" required placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-pink-500 backdrop-blur-sm" />
          <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:opacity-90 transition-all whitespace-nowrap">Subscribe</button>
        </form>
      </TiltCard>
    </div></section>
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
    { q: "Is the Pro plan really one-time?", a: "No. Pro is $20/month. Cancel anytime. No hidden fees." },
  ];
  return (
    <section id="faq" className="py-24"><div className="section-divider" /><div className="max-w-2xl mx-auto px-4 sm:px-6"><h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">Frequently asked questions</h2><div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className={`faq-item rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden ${open === i ? "open" : ""}`}>
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left"><span className="font-medium text-white">{f.q}</span><ChevronDown className={`faq-chevron w-4 h-4 text-white/40 ${open === i ? "open" : ""}`} /></button>
          <div className={`faq-content ${open === i ? "open" : ""}`}><div><div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{f.a}</div></div></div>
        </div>
      ))}
    </div></div></section>
  );
}

function MagneticCTALarge() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const btn = btnRef.current; if (!btn) return;
    const onMove = (e: MouseEvent) => { const rect = btn.getBoundingClientRect(); const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2; const dx = e.clientX - cx, dy = e.clientY - cy; const dist = Math.sqrt(dx * dx + dy * dy); setOffset(dist < 140 ? { x: dx * 0.12, y: dy * 0.12 } : { x: 0, y: 0 }); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);
  return (
    <Link ref={btnRef} href="/tool" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-pink-900/20 group">
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500" />
      <span className="relative btn-shift">Try ThumbRank free <ArrowRight className="btn-arrow w-5 h-5 inline" /></span>
    </Link>
  );
}

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(236,72,153,0.15), rgba(244,114,182,0.08) 40%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center"><h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to stop guessing?</h2><p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">Preview your thumbnail against real competitors in seconds. No signup required.</p><MagneticCTALarge /></div>
    </section>
  );
}

function StickyCTAPill() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => { if (sessionStorage.getItem("tr_sticky_dismissed") === "true") { setDismissed(true); return; } const onScroll = () => setVisible(window.scrollY > 500); window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); return () => window.removeEventListener("scroll", onScroll); }, []);
  const handleDismiss = () => { setDismissed(true); sessionStorage.setItem("tr_sticky_dismissed", "true"); };
  if (dismissed) return null;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 26 }} className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40">
          <div className="flex items-center justify-center gap-3 px-4 py-3 sm:py-3 sm:rounded-full bg-[#0f0f0f]/80 backdrop-blur-xl border-t sm:border border-white/10 sm:shadow-2xl sm:shadow-pink-900/20">
            <span className="text-sm text-white/70 hidden sm:inline">Stop guessing. Start ranking.</span>
            <Link href="/tool" className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-semibold hover:opacity-90 transition-all whitespace-nowrap">Try Free <ArrowRight className="btn-arrow w-3 h-3" /></Link>
            <button onClick={handleDismiss} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors" aria-label="Dismiss"><X className="w-4 h-4" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer className="py-12"><div className="section-divider mb-12" /><div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center"><Sparkles className="w-3 h-3 text-white" /></div><span className="font-bold text-white text-sm">ThumbRank</span></div>
      <div className="flex items-center gap-6 text-sm text-white/40"><Link href="/tool" className="footer-link">Free Tool</Link><Link href="/#pricing" className="footer-link">Pricing</Link><Link href="/#faq" className="footer-link">FAQ</Link></div>
      <div className="text-xs text-white/20">© 2026 ThumbRank. All rights reserved.</div>
    </div></footer>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen text-white selection:bg-pink-500/30">
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
      <StickyCTAPill />
      <Footer />
    </main>
  );
}
