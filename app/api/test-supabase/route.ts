import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error, count } = await supabase.from('competitors').select('*', { count: 'exact' })
    return Response.json({ 
      dataLength: data?.length, 
      count, 
      error: error?.message,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...',
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })
  } catch (err: any) {
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}
