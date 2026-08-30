import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, title, niche = 'general' } = await req.json();
    if (!imageUrl || !title) {
      return NextResponse.json({ error: 'Image and title required' }, { status: 400 });
    }

    const prompt = `You are a YouTube packaging expert. Analyze how the thumbnail image and video title work TOGETHER as a package.
Title: "${title}"
Niche: ${niche}
Evaluate:
1. Do the title and thumbnail tell one story or duplicate each other?
2. Is there a curiosity gap (reason to click)?
3. What's the ONE biggest weakness?
Return ONLY valid JSON:
{
  "combo_score": number (0-100),
  "verdict": "publish" | "rework",
  "story_fit": "string",
  "curiosity_gap": "string",
  "one_fix": "string"
}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        }],
        max_tokens: 300,
      }),
    });

    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // Save to analyses
    const supabase = createClient();
    await supabase.from('analyses').insert({
      type: 'combo',
      input_meta: { title, niche, imageUrl },
      scores: {
        total: result.combo_score || 0,
        verdict: result.verdict,
        story_fit: result.story_fit,
        curiosity_gap: result.curiosity_gap,
        one_fix: result.one_fix,
      },
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Combo API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
