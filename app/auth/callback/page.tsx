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

    // Supabase v2 автоматически обнаружит ?code= или #access_token при инициализации
    // Просто проверяем сессию после этого
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        router.replace('/login?error=' + encodeURIComponent(error.message));
        return;
      }
      if (session) {
        router.replace('/tool');
      } else {
        router.replace('/login?error=no_session');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">Completing sign in...</div>
    </div>
  );
}
