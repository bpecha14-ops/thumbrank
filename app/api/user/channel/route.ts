import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const HARDCODED_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('channel_connections')
      .select('channel_id, channel_title')
      .eq('user_id', HARDCODED_USER_ID)
      .single();

    if (error || !data) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      channel_id: data.channel_id,
      channel_title: data.channel_title,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = createClient();
    await supabase
      .from('channel_connections')
      .delete()
      .eq('user_id', HARDCODED_USER_ID);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
