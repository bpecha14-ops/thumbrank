import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ videos: [] });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: userData } = await supabase.auth.getUser(token);
    const userId = userData.user?.id;
    if (!userId) return NextResponse.json({ videos: [] });

    const { data: conn } = await supabase
      .from('channel_connections')
      .select('access_token, refresh_token, token_expires_at, channel_id')
      .eq('user_id', userId)
      .single();

    if (!conn) return NextResponse.json({ videos: [] });

    let accessToken = conn.access_token;
    if (!conn.token_expires_at || new Date(conn.token_expires_at) < new Date()) {
      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: conn.refresh_token,
          grant_type: 'refresh_token',
        }),
      });
      const tokens = await refreshRes.json();
      if (!refreshRes.ok) throw new Error(tokens.error_description || 'Token refresh failed');
      accessToken = tokens.access_token;
      await supabase.from('channel_connections').update({
        access_token: tokens.access_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      }).eq('user_id', userId);
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const analyticsRes = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?` +
      `ids=channel==MINE&startDate=${startDate}&endDate=${endDate}&` +
      `metrics=impressions,impressionsClickThroughRate&dimensions=video&` +
      `sort=-impressions&maxResults=50`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!analyticsRes.ok) {
      const err = await analyticsRes.text();
      return NextResponse.json({ error: `Analytics API ${analyticsRes.status}` }, { status: 500 });
    }

    const analyticsData = await analyticsRes.json();

    return NextResponse.json({
      videos: analyticsData.rows?.map((row: any) => ({
        videoId: row[0],
        impressions: row[1],
        ctr: row[2],
      })) || [],
    });
  } catch (err: any) {
    console.error('CTR fetch error:', err);
    return NextResponse.json({ videos: [] });
  }
}
