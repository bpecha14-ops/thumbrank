'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setTimeout(() => router.replace('/login?error=auth_config'), 1000);
        return;
      }

      const code = new URLSearchParams(window.location.search).get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage('Failed. Redirecting...');
          setTimeout(() => router.replace('/login?error=' + encodeURIComponent(error.message)), 1000);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/tool');
      } else {
        setTimeout(() => router.replace('/login?error=no_session'), 1000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">{message}</div>
    </div>
  );
}
