import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = 'https://igdswmsdtbaqvlycucum.supabase.co'

export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
