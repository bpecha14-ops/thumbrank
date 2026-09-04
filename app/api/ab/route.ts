import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await supabase.from('ab_tests').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const total = data.clicks_a + data.clicks_b;
  const winner = total === 0 ? null : data.clicks_a > data.clicks_b ? 'A' : data.clicks_a < data.clicks_b ? 'B' : 'Tie';

  return NextResponse.json({
    ...data,
    total_clicks: total,
    winner,
    ctr_a: total > 0 ? ((data.clicks_a / total) * 100).toFixed(1) : '0.0',
    ctr_b: total > 0 ? ((data.clicks_b / total) * 100).toFixed(1) : '0.0',
  });
}
