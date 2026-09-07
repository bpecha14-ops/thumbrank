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
        router.replace('/login?error=auth_config');
        return;
      }

      const code = new URLSearchParams(window.location.search).get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Exchange error:', error.message);
          router.replace('/login?error=' + encodeURIComponent(error.message));
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/tool');
      } else {
        router.replace('/login?error=no_session');
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
