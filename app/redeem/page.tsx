'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { KeyRound, Loader2, Check, AlertCircle, ExternalLink, Lock, Sparkles } from 'lucide-react';

const PADDLE_URL = 'https://thumbrank.paddle.com/l/pro';

export default function RedeemPage() {
  const { user, isPro, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.rpc('redeem_license', { p_key: key.trim() });
      if (error) throw error;
      if (data?.success) {
        setStatus('success');
        setMessage('Your account has been upgraded to Pro!');
        await refreshProfile();
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setStatus('error');
        setMessage(data?.error || 'Invalid license key.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (!loading && isPro) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-lg px-4 sm:px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/15">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">You're already Pro!</h1>
          <p className="mt-4 text-neutral-400">You have unlimited previews, A/B testing, and CTR scores.</p>
          <Link href="/tool" className="inline-block mt-8">
            <Button className="bg-pink-600 hover:bg-pink-500 text-white">Go to the tool</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!loading && !user) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-lg px-4 sm:px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-600/15">
            <Lock className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Sign in to redeem your key</h1>
          <p className="mt-4 text-neutral-400">You need an account to activate your Pro license key.</p>
          <Link href="/login?mode=signup" className="inline-block mt-8">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-500 text-white">Create a free account</Button>
          </Link>
          <Link href="/login" className="block mt-4">
            <Button variant="link" className="text-neutral-400">Already have an account? Sign in →</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600/15">
            <KeyRound className="h-7 w-7 text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Redeem your Pro key</h1>
          <p className="mt-3 text-neutral-400">Enter the license key you received from Paddle to unlock Pro.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600/20 text-pink-400 text-sm font-bold shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Purchase on Paddle</h3>
              <p className="mt-1 text-xs text-neutral-400">Buy a Pro license for $20/month. Paddle will email you a license key instantly.</p>
              <a href={PADDLE_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-3">
                <Button size="sm" className="bg-pink-600 hover:bg-pink-500 text-white">
                  Buy on Paddle <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleRedeem} className="rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-sm p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600/20 text-pink-400 text-sm font-bold shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Enter your license key</h3>
              <p className="mt-1 text-xs text-neutral-400">Paste the key from your Paddle purchase email or dashboard.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="key" className="block text-sm text-neutral-300">License key</label>
            <input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-neutral-600 font-mono outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              autoComplete="off"
            />
          </div>

          {status === 'success' && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              <Check className="h-4 w-4 shrink-0" /> {message}
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" /> {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={status === 'loading' || !key.trim()}
            className="mt-5 w-full bg-pink-600 hover:bg-pink-500 text-white"
          >
            {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Activate Pro
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Each license key can only be used once. Your key is validated securely in our database.
        </p>
      </div>
    </div>
  );
}
