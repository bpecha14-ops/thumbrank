'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refreshProfile } = useAuth();
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        await refreshProfile();
        router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refreshProfile();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="flex items-center gap-2 mb-8 relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 glow-purple">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">ThumbRank</span>
      </Link>

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-8">
        <h1 className="text-2xl font-bold text-white text-center">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-2 text-sm text-neutral-400 text-center">{mode === 'login' ? 'Sign in to access unlimited previews and A/B testing' : 'Start with 3 free previews — upgrade anytime'}</p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <button onClick={handleGoogle} disabled={googleLoading || loading} className="mt-6 w-full flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-100 transition-colors disabled:opacity-50">
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.58 2.68-3.91 2.68-6.61z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.32A9 9 0 0 0 9 18z" fill="#34A853" />
              <path d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.03l3.01-2.32z" fill="#FBBC05" />
              <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-neutral-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 bg-[#0a0a0a] border-white/10 text-white placeholder:text-neutral-600" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="pl-10 bg-[#0a0a0a] border-white/10 text-white placeholder:text-neutral-600" />
            </div>
          </div>
          <Button type="submit" disabled={loading || googleLoading} className="w-full bg-violet-600 hover:bg-violet-500 text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight className="ml-2 h-4 w-4" /></>)}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} className="text-violet-400 hover:text-violet-300 font-medium">{mode === 'login' ? 'Sign up free' : 'Sign in'}</button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <AuthForm />
    </Suspense>
  );
}
