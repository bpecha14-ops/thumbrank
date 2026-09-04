import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { video_url, variant_a_url, variant_b_url } = body;

  if (!video_url || !variant_a_url || !variant_b_url) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const shortId = nanoid(8);

  const { data, error } = await supabase
    .from('ab_tests')
    .insert({
      id: shortId,
      user_id: user.id,
      video_url,
      variant_a_url,
      variant_b_url,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thumbrankpro.com';
  
  return NextResponse.json({
    test: data,
    links: {
      a: `${baseUrl}/ab/${shortId}?variant=a`,
      b: `${baseUrl}/ab/${shortId}?variant=b`,
      dashboard: `${baseUrl}/ab/${shortId}`,
    }
  });
}
