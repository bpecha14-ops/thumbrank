'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Eye, GitCompareArrows, Gauge, KeyRound, ArrowRight, Sparkles, TrendingUp, Lock } from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, loading, isPro } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <SiteNav />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const cards = [
    { icon: Eye, title: 'Thumbnail Preview', desc: 'Upload your thumbnail and see it in a real YouTube search mockup.', href: '/tool', cta: 'Open tool', pro: false },
    { icon: GitCompareArrows, title: 'A/B Testing', desc: 'Compare 2-3 thumbnail variants side-by-side with CTR scores.', href: '/ab-test', cta: 'Start A/B test', pro: true },
    { icon: Gauge, title: 'CTR Score', desc: 'Get an instant 0-100 score based on contrast, color, and readability.', href: '/tool', cta: 'Check a score', pro: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {user.email?.split('@')[0]}</h1>
          <p className="mt-2 text-sm text-neutral-400">Here's your ThumbRank overview.</p>
        </div>

        <div className={`rounded-2xl border p-6 mb-8 ${isPro ? 'border-violet-500/40 bg-gradient-to-b from-violet-600/10 to-[#111]' : 'border-white/10 bg-[#111]'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPro ? 'bg-violet-600 text-white' : 'bg-white/10 text-neutral-300'}`}>{isPro ? 'PRO' : 'FREE'}</span>
                <span className="text-sm text-neutral-400">Current plan</span>
              </div>
              {isPro ? (
                <p className="mt-2 text-lg text-white">You have unlimited previews, A/B testing, and CTR scores.</p>
              ) : (
                <p className="mt-2 text-lg text-white">{profile?.remaining !== null && profile?.remaining !== undefined ? `${profile.remaining} of 3 free previews left this month` : '3 free previews per month'}</p>
              )}
            </div>
            {!isPro && (
              <Link href="/redeem"><Button className="bg-violet-600 hover:bg-violet-500 text-white shrink-0"><KeyRound className="mr-2 h-4 w-4" /> Upgrade to Pro</Button></Link>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const locked = card.pro && !isPro;
            return (
              <div key={card.title} className="group rounded-2xl border border-white/10 bg-[#111] p-6 hover:border-violet-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/15 text-violet-400"><card.icon className="h-5 w-5" /></div>
                  {locked && <Lock className="h-4 w-4 text-neutral-500" />}
                </div>
                <h3 className="text-base font-semibold text-white">{card.title}</h3>
                <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">{card.desc}</p>
                <Link href={card.href} className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full border-white/10 text-white hover:bg-white/5 group-hover:border-violet-500/30">{card.cta} <ArrowRight className="ml-2 h-3 w-3" /></Button>
                </Link>
              </div>
            );
          })}
        </div>

        {!isPro && (
          <div className="mt-8 rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-600/10 to-[#111] p-8 text-center">
            <TrendingUp className="h-10 w-10 text-violet-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white">Unlock everything with Pro</h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-md mx-auto">Unlimited previews, A/B testing with 2-3 variants, and instant CTR scores — all for $12/month.</p>
            <Link href="/redeem" className="inline-block mt-6"><Button className="bg-violet-600 hover:bg-violet-500 text-white glow-purple"><Sparkles className="mr-2 h-4 w-4" /> Upgrade to Pro</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
