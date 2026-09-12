import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUserId(req: Request): string {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '').trim();
  return token;
}

export async function GET(req: Request) {
  const token = getUserId(req);
  if (!token) return NextResponse.json({ predictions: [] });

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: userData } = await supabase.auth.getUser(token);
  const userId = userData.user?.id;
  if (!userId) return NextResponse.json({ predictions: [] });

  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ predictions: data });
}
