import { createClient } from '@supabase/supabase-js';

let client: any = null;

export function getSupabaseClient() {
  if (client) return client;
  
  const url = 'https://igdswmsdtbaqvlycucum.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!key) {
    console.warn('Supabase key missing');
    return null;
  }
  
  client = createClient(url, key);
  return client;
}
