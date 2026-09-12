import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  // Identify the logged-in user from the Supabase session cookie
  let userId = '';
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/sb-[a-z0-9]+-auth-token=([^;]+)/);
  if (match) {
    try {
      const session = JSON.parse(decodeURIComponent(match[1]));
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data } = await supabase.auth.getUser(session.access_token);
      userId = data.user?.id || '';
    } catch { /* fall through */ }
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://thumbrankpro.com';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${base}/api/auth/youtube/callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly',
    access_type: 'offline',
    prompt: 'consent',
  });
  // Pass the real user id through OAuth state
  if (userId) params.set('state', userId);

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
