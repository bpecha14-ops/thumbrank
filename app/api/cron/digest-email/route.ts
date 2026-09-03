import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDigestEmail } from '@/lib/jobs/digest-email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Find users with competitors and email preferences
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id, email')
      .not('email', 'is', null);

    if (userError) throw userError;
    if (!users?.length) return NextResponse.json({ sent: 0, message: 'No users' });

    let totalSent = 0;

    for (const user of users) {
      // 2. Get user's competitors
      const { data: competitors } = await supabase
        .from('competitors')
        .select('id, name')
        .eq('user_id', user.id);

      if (!competitors?.length) continue;

      const competitorIds = competitors.map(c => c.id);

      // 3. Get unsent videos from last 24h
      const { data: videos } = await supabase
        .from('competitor_videos')
        .select('title, thumbnail_url, published_at, video_id, competitor_id, digest_sent')
        .in('competitor_id', competitorIds)
        .eq('digest_sent', false)
        .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('published_at', { ascending: false })
        .limit(10);

      if (!videos?.length) continue;

      // 4. Map competitor names
      const videosWithNames = videos.map(v => ({
        title: v.title,
        thumbnail_url: v.thumbnail_url,
        published_at: v.published_at,
        video_id: v.video_id,
        competitor_name: competitors.find(c => c.id === v.competitor_id)?.name || 'Unknown',
      }));

      // 5. Send email
      await sendDigestEmail(user.email, videosWithNames);

      // 6. Mark as sent
      const videoIds = videos.map(v => v.video_id);
      await supabase
        .from('competitor_videos')
        .update({ digest_sent: true })
        .in('video_id', videoIds);

      totalSent++;
    }

    return NextResponse.json({ success: true, sent: totalSent });
  } catch (err: any) {
    console.error('Digest error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
