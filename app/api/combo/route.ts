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

Return ONLY a JSON object in this exact format:
{
  "combo_score": 72,
  "verdict": "publish",
  "story_fit": "The title promises a secret, the thumbnail shows the result — they complement.",
  "curiosity_gap": "Strong — viewer wants to know the secret.",
  "one_fix": "Add a subtle arrow pointing to the key element."
}

Rules:
- combo_score must be a number 0-100
- verdict must be exactly "publish" or "rework"
- If score >= 70, verdict MUST be "publish"
- If score < 70, verdict MUST be "rework"
- story_fit, curiosity_gap, one_fix must be short strings`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } },
        ]}],
        max_tokens: 400,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    let result: any = {};
    try {
      result = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
    }

    // Validate and fix
    const score = typeof result.combo_score === 'number' ? result.combo_score : 50;
    const verdict = score >= 70 ? 'publish' : 'rework';

    const final = {
      combo_score: score,
      verdict,
      story_fit: result.story_fit || 'Analysis unavailable',
      curiosity_gap: result.curiosity_gap || 'Analysis unavailable',
      one_fix: result.one_fix || 'Try improving contrast or title clarity.',
    };

    // Save to analyses
    const supabase = createClient();
    await supabase.from('analyses').insert({
      type: 'combo',
      input_meta: { title, niche, imageUrl },
      scores: { total: final.combo_score, verdict: final.verdict, story_fit: final.story_fit, curiosity_gap: final.curiosity_gap, one_fix: final.one_fix },
    });

    return NextResponse.json(final);
  } catch (err: any) {
    console.error('Combo API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
