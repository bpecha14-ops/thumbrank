import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  const url = 'https://igdswmsdtbaqvlycucum.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!key) {
    console.warn('Supabase key missing');
    return null;
  }
  
  return createClient(url, key);
}
