'use client';

import { Sparkles, AlertCircle } from 'lucide-react';

/**
 * Friendly fallback shown when Supabase env vars are missing.
 * Prevents the app from crashing with "supabaseUrl is required".
 */
export function SupabaseConfigError() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/15">
          <Sparkles className="h-7 w-7 text-violet-400" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <h1 className="text-xl font-bold text-white">Supabase configuration missing</h1>
        </div>
        <p className="text-sm text-neutral-400 leading-relaxed">
          This app needs a Supabase project to handle accounts and saved data.
          Please add your Supabase URL and anon key to the environment variables
          (<code className="text-violet-400">.env.local</code>) and restart the server.
        </p>
      </div>
    </div>
  );
}
