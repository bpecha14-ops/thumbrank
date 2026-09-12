import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function getUserId(req: Request): Promise<string> {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '').trim();
  if (!token) return '';
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase.auth.getUser(token);
  return data.user?.id || '';
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ connected: false });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase
      .from('channel_connections')
      .select('channel_id, channel_title')
      .eq('user_id', userId)
      .single();

    if (error || !data) return NextResponse.json({ connected: false });

    return NextResponse.json({
      connected: true,
      channel_id: data.channel_id,
      channel_title: data.channel_title,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await supabase.from('channel_connections').delete().eq('user_id', userId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
