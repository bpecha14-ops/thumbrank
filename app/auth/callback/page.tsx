'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const handleAuth = async () => {
      console.log('=== CALLBACK START ===');
      
      const supabase = getSupabaseClient();
      console.log('1. Supabase client:', supabase ? 'OK' : 'NULL');
      
      if (!supabase) {
        router.replace('/login?error=auth_config');
        return;
      }

      const code = new URLSearchParams(window.location.search).get('code');
      console.log('2. Code in URL:', code ? code.substring(0, 10) + '...' : 'MISSING');

      if (code) {
        console.log('3. Exchanging code...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        console.log('4. Exchange result:', { 
          hasSession: !!data.session, 
          error: error?.message || 'none' 
        });
        
        if (error) {
          console.error('5. Exchange failed:', error.message);
          router.replace('/login?error=' + encodeURIComponent(error.message));
          return;
        }
        
        if (data.session) {
          console.log('6. Session created! Redirecting to /tool');
          router.replace('/tool');
          return;
        }
      }

      console.log('7. No session from exchange, checking getSession()...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('8. getSession() result:', session ? 'FOUND' : 'NULL');
      
      if (session) {
        router.replace('/tool');
      } else {
        console.log('9. Final: no session, redirecting to login');
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
