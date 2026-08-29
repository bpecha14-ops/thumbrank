export async function GET() {
  try {
    const res = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ', {
      headers: { 'User-Agent': 'ThumbRank/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    const text = await res.text()
    return Response.json({ status: res.status, ok: res.ok, length: text.length })
  } catch (err: any) {
    return Response.json({ error: err.message, cause: err.cause?.message || 'no cause' }, { status: 500 })
  }
}
