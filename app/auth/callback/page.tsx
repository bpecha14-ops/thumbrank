'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase уже обменял ?code= на сессию при создании клиента в layout
    // Просто ждём 1 секунду и редиректим на /tool
    const t = setTimeout(() => {
      router.replace('/tool');
    }, 1000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">Signing you in...</div>
    </div>
  );
}
