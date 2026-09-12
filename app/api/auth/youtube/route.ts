import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  let userId = '';
  if (token) {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase.auth.getUser(token);
    userId = data.user?.id || '';
  }

  if (!userId) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://thumbrankpro.com';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${base}/api/auth/youtube/callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly',
    access_type: 'offline',
    prompt: 'consent',
    state: userId,
  });

  // Return the URL as JSON — the browser must navigate there itself
  return NextResponse.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
}
