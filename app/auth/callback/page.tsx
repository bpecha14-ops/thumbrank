'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://igdswmsdtbaqvlycucum.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!supabaseKey) {
      router.replace('/login?error=auth_config');
      return;
    }

    // НОВЫЙ client на callback page — он автоматически увидит ?code= в URL
    const supabase = createClient(supabaseUrl, supabaseKey);

    setTimeout(async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        router.replace('/login?error=' + encodeURIComponent(error.message));
        return;
      }
      
      if (session) {
        router.replace('/tool');
      } else {
        router.replace('/login?error=no_session');
      }
    }, 500);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">Completing sign in...</div>
    </div>
  );
}
