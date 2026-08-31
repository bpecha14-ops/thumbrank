import { createClient } from '@/lib/supabase/server';

export async function getValidToken(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('channel_connections')
    .select('access_token, refresh_token, token_expires_at')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  // Check if token expired
  if (new Date(data.token_expires_at) < new Date()) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: data.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    const tokens = await res.json();
    if (!res.ok) return null;

    await supabase
      .from('channel_connections')
      .update({
        access_token: tokens.access_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      })
      .eq('user_id', userId);

    return tokens.access_token;
  }

  return data.access_token;
}
