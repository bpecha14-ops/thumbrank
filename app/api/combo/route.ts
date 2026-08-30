import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, title, niche = 'general' } = await req.json();
    if (!imageUrl || !title) {
      return NextResponse.json({ error: 'Image and title required' }, { status: 400 });
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'system',
          content: 'You must respond with ONLY valid JSON. No markdown, no explanations outside JSON.'
        }, {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze this YouTube thumbnail + title as one package. Title: "${title}". Niche: ${niche}. Return ONLY JSON: {"combo_score": number 0-100, "verdict": "publish" or "rework", "story_fit": string, "curiosity_gap": string, "one_fix": string}. Score >= 70 = publish. Score < 70 = rework.` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        }],
        max_tokens: 300,
      }),
    });

    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    let content = data.choices?.[0]?.message?.content || '{}';
    
    // Clean markdown
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let result: any = {};
    try {
      result = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
    }

    // Hard fallback
    const score = typeof result.combo_score === 'number' && !isNaN(result.combo_score) 
      ? Math.max(0, Math.min(100, result.combo_score)) 
      : 50;
    
    const final = {
      combo_score: score,
      verdict: score >= 70 ? 'publish' : 'rework',
      story_fit: result.story_fit || 'Title and thumbnail alignment needs review.',
      curiosity_gap: result.curiosity_gap || 'Curiosity gap unclear.',
      one_fix: result.one_fix || 'Improve contrast between subject and background.',
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
