import { createClient } from '@supabase/supabase-js';

let client: any = null;

export function getSupabaseClient() {
  if (client) return client;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!url || !key) {
    console.warn('Supabase env missing — auth disabled');
    return null;
  }
  
  client = createClient(url, key);
  return client;
}
