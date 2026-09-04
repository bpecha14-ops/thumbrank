import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  const variant = searchParams.get('variant') as 'a' | 'b';

  if (!id || !variant || !['a','b'].includes(variant)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  }

  const { data: test, error } = await supabase.from('ab_tests').select('*').eq('id', id).single();
  if (error || !test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (test.status !== 'active') return NextResponse.json({ error: 'Not active' }, { status: 400 });

  const col = variant === 'a' ? 'clicks_a' : 'clicks_b';
  await supabase.from('ab_tests').update({ [col]: test[col] + 1 }).eq('id', id);

  return NextResponse.redirect(test.video_url, 302);
}
