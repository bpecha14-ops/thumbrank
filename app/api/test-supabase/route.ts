export const runtime = 'nodejs'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    // Тест 1: plain fetch к Supabase REST API (без библиотеки)
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key!,
        'Authorization': `Bearer ${key!}`
      }
    })
    const text = await res.text()
    
    return Response.json({ 
      url: url?.slice(0, 30) + '...',
      hasKey: !!key,
      plainFetchStatus: res.status,
      plainFetchOk: res.ok,
      plainFetchText: text.slice(0, 100)
    })
  } catch (err: any) {
    return Response.json({ 
      error: err.message, 
      cause: err.cause?.message || 'no cause',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...'
    }, { status: 500 })
  }
}
