import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://thumbrankpro.com'}/api/auth/youtube/callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(tokens.error_description || 'Token exchange failed');
    }

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`,
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      throw new Error('No YouTube channel found');
    }

    await supabase.from('channel_connections').upsert({
      user_id: '00000000-0000-0000-0000-000000000000',
      channel_id: channel.id,
      channel_title: channel.snippet?.title,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    }, { onConflict: 'user_id' });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'https://thumbrankpro.com'}/settings?connected=true`);
  } catch (err: any) {
    console.error('YouTube OAuth error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
