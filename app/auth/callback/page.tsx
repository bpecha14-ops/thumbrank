'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        router.push('/login?error=auth_not_configured');
        return;
      }
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        router.push('/login?error=' + encodeURIComponent(error.message));
        return;
      }
      
      if (session) {
        router.push('/tool');
      } else {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            router.push('/login?error=' + encodeURIComponent(exchangeError.message));
            return;
          }
          router.push('/tool');
        } else {
          router.push('/login');
        }
      }
    };
    
    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">Signing you in...</div>
    </div>
  );
}
