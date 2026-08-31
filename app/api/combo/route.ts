import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageUrl, title } = await req.json();
    if (!imageUrl || !title) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
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
          role: 'user',
          content: [
            { type: 'text', text: `Analyze thumbnail + title. Title: "${title}". Return ONLY JSON: {"combo_score": number, "verdict": "publish" or "rework", "one_fix": string}.` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        }],
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `OpenAI ${res.status}: ${err}` }, { status: 500 });
    }

    const data = await res.json();
    let content = data.choices?.[0]?.message?.content || '{}';
    content = content.replace(/```json|```/g, '').trim();
    
    let result: any = {};
    try {
      result = JSON.parse(content);
    } catch {
      result = {};
    }

    const score = typeof result.combo_score === 'number' ? result.combo_score : 50;

    return NextResponse.json({
      combo_score: score,
      verdict: score >= 70 ? 'publish' : 'rework',
      one_fix: result.one_fix || 'Improve alignment.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
