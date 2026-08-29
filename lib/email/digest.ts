export async function sendDigest(userEmail: string, videos: any[]) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.log('DIGEST: no RESEND_API_KEY, skipping')
    return { skipped: true, reason: 'no_api_key' }
  }

  if (!videos || videos.length === 0) {
    return { skipped: true, reason: 'no_videos' }
  }

  const topVideo = videos[0]
  const outlierBadge = topVideo.outlier_multiplier 
    ? `${topVideo.outlier_multiplier.toFixed(1)}x outlier` 
    : 'New video'

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="margin:0 0 16px;">🌅 Morning Briefing from ThumbRank</h2>
      <p style="color:#666;">Your competitors uploaded <strong>${videos.length}</strong> new video(s) since yesterday.</p>
      
      <div style="border:1px solid #e5e5e5;border-radius:12px;padding:16px;margin:16px 0;">
        <img src="${topVideo.thumbnail_url}" style="width:100%;border-radius:8px;" />
        <h3 style="margin:12px 0 8px;">${topVideo.title}</h3>
        <span style="background:#10b981;color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;">${outlierBadge}</span>
        ${topVideo.ai_breakdown ? `<p style="color:#444;margin-top:12px;font-size:14px;">${topVideo.ai_breakdown}</p>` : ''}
        <a href="https://thumbrankpro.com/digest" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:8px;">View Full Briefing</a>
      </div>
      
      <p style="color:#999;font-size:12px;">You're receiving this because you track competitors on ThumbRank.</p>
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: 'ThumbRank <onboarding@resend.dev>',
        to: userEmail,
        subject: `Morning Briefing: ${videos.length} new video${videos.length > 1 ? 's' : ''} from your competitors`,
        html
      })
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('DIGEST: Resend error', res.status, text)
      return { sent: false, error: text }
    }

    return { sent: true, count: videos.length }
  } catch (err: any) {
    console.error('DIGEST: send error', err.message)
    return { sent: false, error: err.message }
  }
}
