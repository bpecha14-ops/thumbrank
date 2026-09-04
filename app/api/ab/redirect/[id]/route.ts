import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;
  const searchParams = req.nextUrl.searchParams;
  const variant = searchParams.get('variant') as 'a' | 'b';

  if (!variant || !['a', 'b'].includes(variant)) {
    return NextResponse.json({ error: 'Invalid variant' }, { status: 400 });
  }

  // Получаем тест
  const { data: test, error } = await supabase
    .from('ab_tests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !test) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (test.status !== 'active') {
    return NextResponse.json({ error: 'Test not active' }, { status: 400 });
  }

  // Инкремент клика
  const column = variant === 'a' ? 'clicks_a' : 'clicks_b';
  await supabase
    .from('ab_tests')
    .update({ [column]: test[column] + 1 })
    .eq('id', id);

  // Логируем клик (опционально, для аналитики)
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  await supabase.from('ab_clicks').insert({
    ab_test_id: id,
    variant,
    ip_hash: await hashIp(ip),
    user_agent: req.headers.get('user-agent') || '',
    referrer: req.headers.get('referer') || '',
  });

  // 302 редирект на видео
  return NextResponse.redirect(test.video_url, 302);
}

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'thumbrank-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}
