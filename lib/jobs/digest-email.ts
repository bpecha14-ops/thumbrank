import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface DigestVideo {
  title: string;
  thumbnail_url: string | null;
  published_at: string;
  video_id: string;
  competitor_name: string;
}

export async function sendDigestEmail(
  to: string,
  videos: DigestVideo[]
) {
  if (!videos.length) return { success: false, error: 'No videos' };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background: #1C1428; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 32px; }
    .header h1 { font-size: 24px; margin: 0; background: linear-gradient(135deg, #ec4899, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header p { color: #a1a1aa; margin: 8px 0 0; }
    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin-bottom: 16px; display: flex; gap: 16px; }
    .card img { width: 120px; height: 68px; border-radius: 8px; object-fit: cover; background: #2a2a2a; flex-shrink: 0; }
    .card-content { flex: 1; min-width: 0; }
    .card-title { font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-meta { font-size: 12px; color: #a1a1aa; margin: 0; }
    .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
    .footer a { color: #ec4899; text-decoration: none; }
    .footer p { font-size: 12px; color: #71717a; margin: 8px 0 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☕ Morning Briefing</h1>
      <p>${videos.length} new video${videos.length > 1 ? 's' : ''} from your competitors</p>
    </div>
    ${videos.map(v => `
    <div class="card">
      <img src="${v.thumbnail_url || 'https://thumbrankpro.com/og-image.png'}" alt="" />
      <div class="card-content">
        <p class="card-title">${v.title}</p>
        <p class="card-meta">${v.competitor_name} · ${new Date(v.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      </div>
    </div>
    `).join('')}
    <div class="footer">
      <a href="https://thumbrankpro.com/digest">Open ThumbRank →</a>
      <p>You're receiving this because you track competitors on ThumbRank.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const { data, error } = await resend.emails.send({
    from: 'ThumbRank <digest@thumbrankpro.com>',
    to,
    subject: `☕ ${videos.length} competitor update${videos.length > 1 ? 's' : ''} — Morning Briefing`,
    html,
  });

  if (error) throw error;
  return { success: true, id: data?.id };
}
