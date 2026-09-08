'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      router.replace('/login?error=auth_config');
      return;
    }

    const t = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        router.replace(session ? '/tool' : '/login?error=no_session');
      });
    }, 2000);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">Signing in...</div>
    </div>
  );
}
