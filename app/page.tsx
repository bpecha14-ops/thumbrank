'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SiteNav } from '@/components/site-nav';
import { YouTubeMockup, MockupVideo } from '@/components/youtube-mockup';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Eye,
  GitCompareArrows,
  Gauge,
  Download,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
  Star,
  TrendingUp,
} from 'lucide-react';

const heroVideos: MockupVideo[] = [
  {
    thumbnailUrl: null,
    title: 'I Tried Growing a YouTube Channel for 30 Days (SHOCKING Results)',
    channelName: 'CreatorLab',
    channelVerified: true,
    viewCount: '1.2M',
    uploadDate: '3 days ago',
    duration: '12:45',
    isUser: true,
  },
  {
    thumbnailUrl: null,
    title: 'How I Got 100K Subscribers in 90 Days — Full Strategy',
    channelName: 'Growth Hub',
    channelVerified: true,
    viewCount: '847K',
    uploadDate: '1 week ago',
    duration: '15:32',
  },
  {
    thumbnailUrl: null,
    title: 'The YouTube Algorithm Explained in 10 Minutes',
    channelName: 'VidIQ',
    channelVerified: true,
    viewCount: '2.1M',
    uploadDate: '2 weeks ago',
    duration: '10:12',
  },
];

const features = [
  {
    icon: Eye,
    title: 'Realistic Search Preview',
    desc: 'See your thumbnail exactly how viewers will — inside a pixel-accurate YouTube search results page.',
  },
  {
    icon: GitCompareArrows,
    title: 'A/B Test Variants',
    desc: 'Upload 2-3 thumbnail versions and compare them side-by-side in the same search mockup.',
  },
  {
    icon: Gauge,
    title: 'CTR Score',
    desc: 'Get an instant 0-100 score based on contrast, colorfulness, and text readability — no AI APIs, all in-browser.',
  },
  {
    icon: Download,
    title: 'Export as PNG',
    desc: 'Download your mockup as a high-quality PNG to share with your team — all rendered client-side.',
  },
  {
    icon: ShieldCheck,
    title: 'No Sign-up Required',
    desc: 'The core tool works without an account. Sign in only when you want unlimited previews and A/B testing.',
  },
  {
    icon: Zap,
    title: 'Zero Server Costs',
    desc: 'All image processing happens in your browser. No uploads, no storage bills, no privacy worries.',
  },
];

const faqs = [
  {
    q: 'Do I need to create an account to use ThumbRank?',
    a: 'No. The free tool works without any sign-up — just upload your thumbnail and go. You only need an account if you want unlimited previews, A/B testing, and the CTR score.',
  },
  {
    q: 'How does the free plan work?',
    a: 'Free users get 3 previews per month. Each time you render a YouTube search mockup, it counts as one preview. The counter resets every 30 days.',
  },
  {
    q: 'How do I upgrade to Pro?',
    a: 'Click "Upgrade to Pro" to visit our Gumroad page. After purchasing, Gumroad gives you a license key. Enter it on the Redeem Key page and your account is instantly upgraded to Pro.',
  },
  {
    q: 'Do you store my thumbnail images?',
    a: 'No. All image processing happens entirely in your browser using the Canvas API. Your thumbnails never leave your device.',
  },
  {
    q: 'How is the CTR Score calculated?',
    a: 'The score combines image contrast, color saturation, edge density (text/subject separation), and brightness. It runs 100% in your browser — no paid AI APIs are used.',
  },
  {
    q: 'Can I use ThumbRank for client work?',
    a: 'Absolutely. Export mockups as PNGs and share them with clients or your team to get feedback before publishing.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300 mb-6">
                <Star className="h-3 w-3 fill-violet-400 text-violet-400" />
                Trusted by 2,000+ YouTube creators
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                See your thumbnail <span className="text-gradient-purple">before</span> the world does.
              </h1>
              <p className="mt-6 text-lg text-neutral-400 max-w-lg leading-relaxed">
                ThumbRank drops your thumbnail into a realistic YouTube search results page so you can see how it stands out against competitors — before you hit publish.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/tool">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-500 text-white glow-purple">
                    Try the free tool <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/#pricing">
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    View pricing
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-neutral-500">No sign-up required · No image uploads to a server</p>
            </div>

            {/* Hero mockup */}
            <div className="animate-fade-in-up rounded-2xl border border-white/10 overflow-hidden shadow-2xl glow-purple" style={{ animationDelay: '0.1s' }}>
              <YouTubeMockup keyword="how to grow on youtube" videos={heroVideos} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-[#0c0c0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Previews generated', value: '180K+' },
            { label: 'Active creators', value: '2,400' },
            { label: 'Avg. CTR lift', value: '+23%' },
            { label: 'Server-side storage', value: '0 KB' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
              <div className="text-xs sm:text-sm text-neutral-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to <span className="text-gradient-purple">stand out</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-lg">
            Stop guessing whether your thumbnail will get clicked. See it, test it, score it — all in your browser.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-[#111] p-6 hover:border-violet-500/40 hover:bg-[#141414] transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/15 text-violet-400 group-hover:bg-violet-600/25 transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/5 bg-[#0c0c0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="mt-4 text-neutral-400 text-lg">Three steps to a better thumbnail.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload your thumbnail', desc: 'Drop in your PNG or JPG (up to 5MB). It stays in your browser — nothing is uploaded.' },
              { step: '02', title: 'Add competitors', desc: 'Paste in up to two competitor thumbnails to see your video in context, just like real YouTube.' },
              { step: '03', title: 'Preview & export', desc: 'See the mockup, check your CTR score, and download a PNG to share with your team.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-5xl font-bold text-violet-600/30">{s.step}</div>
                <h3 className="mt-3 text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple pricing</h2>
          <p className="mt-4 text-neutral-400 text-lg">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl border border-white/10 bg-[#111] p-8">
            <h3 className="text-xl font-semibold text-white">Free</h3>
            <p className="mt-1 text-sm text-neutral-400">For trying it out</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-neutral-400">/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                '3 previews per month',
                'YouTube search mockup',
                '2 competitor slots',
                'PNG export',
                'No sign-up required',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-neutral-300">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/tool" className="block mt-8">
              <Button className="w-full" variant="outline" size="lg">Start free</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border border-violet-500/50 bg-gradient-to-b from-violet-600/10 to-[#111] p-8 glow-purple">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
              Most popular
            </div>
            <h3 className="text-xl font-semibold text-white">Pro</h3>
            <p className="mt-1 text-sm text-neutral-400">For serious creators</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-white">$12</span>
              <span className="text-neutral-400">/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                'Unlimited previews',
                'A/B testing (2-3 variants)',
                'CTR Score (0-100)',
                'Unlimited competitor slots',
                'Priority PNG export',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-neutral-200">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/redeem" className="block mt-8">
              <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white" size="lg">
                Upgrade to Pro
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-neutral-500">Pay via Gumroad · Instant license key</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-[#0c0c0c]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
          <TrendingUp className="h-10 w-10 text-violet-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to see how you stack up?</h2>
          <p className="mt-4 text-neutral-400 text-lg">Upload a thumbnail and find out in seconds.</p>
          <Link href="/tool" className="inline-block mt-8">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-500 text-white glow-purple">
              Open the free tool <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-white/10 bg-[#111] px-5">
              <AccordionTrigger className="text-left text-white hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-purple-600">
              <span className="text-xs">T</span>
            </div>
            <span className="text-sm font-semibold text-white">ThumbRank</span>
          </div>
          <div className="flex gap-4 text-xs text-neutral-500">
            <a href="/terms" className="hover:text-neutral-300">Terms</a>
            <a href="/privacy" className="hover:text-neutral-300">Privacy</a>
            <a href="/refund" className="hover:text-neutral-300">Refund</a>
          </div>
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} ThumbRank</p>
        </div>
      </footer>
    </div>
  );
}
