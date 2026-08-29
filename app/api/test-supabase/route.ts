export const runtime = 'nodejs'

export async function GET() {
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key!,
        'Authorization': `Bearer ${key!}`
      }
    })
    const text = await res.text()
    
    return Response.json({ 
      status: res.status,
      ok: res.ok,
      length: text.length,
      url: url?.slice(0, 30) + '...',
      hasKey: !!key
    })
  } catch (err: any) {
    return Response.json({ 
      error: err.message, 
      cause: err.cause?.message || 'no cause',
      url: process.env.SUPABASE_URL?.slice(0, 30) + '...'
    }, { status: 500 })
  }
}
