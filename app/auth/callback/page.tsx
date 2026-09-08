'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    const code = new URLSearchParams(window.location.search).get('code');
    
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.replace('/login?error=' + encodeURIComponent(error.message));
        } else {
          router.replace('/tool');
        }
      });
    } else {
      router.replace('/login?error=no_code');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">Signing in...</div>
    </div>
  );
}
