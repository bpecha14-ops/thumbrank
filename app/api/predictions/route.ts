import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { title, predictedScore, niche = 'general' } = await req.json();
    
    if (!title || typeof predictedScore !== 'number') {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const tier = predictedScore >= 70 ? 'strong' : predictedScore >= 40 ? 'ok' : 'weak';

    const { data, error } = await supabase
      .from('predictions')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        predicted_score: predictedScore,
        predicted_tier: tier,
        input_meta: { title, niche },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, tier });
  } catch (err: any) {
    console.error('Predictions error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
