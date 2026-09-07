'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage('Auth error');
      setTimeout(() => router.replace('/login?error=auth_config'), 2000);
      return;
    }

    // Supabase v2 автоматически обменивает ?code= на сессию при инициализации клиента
    // Просто проверяем сессию каждые 500мс, пока не появится
    let attempts = 0;
    const check = setInterval(async () => {
      attempts++;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        clearInterval(check);
        router.replace('/tool');
        return;
      }
      
      if (attempts >= 10) {
        clearInterval(check);
        setMessage('Failed. Redirecting...');
        setTimeout(() => router.replace('/login?error=timeout'), 1500);
      }
    }, 500);

    return () => clearInterval(check);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">{message}</div>
    </div>
  );
}
