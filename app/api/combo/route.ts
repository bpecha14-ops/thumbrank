import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl, title } = await req.json();
    if (!imageUrl || !title) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a YouTube packaging expert. Analyze thumbnail + title as one package. Return ONLY JSON: {"combo_score": number 0-100, "verdict": "publish" or "rework", "one_fix": string}. Score >= 70 = publish.`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Title: "${title}"` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content.replace(/```json|```/g, '').trim());
    const score = typeof result.combo_score === 'number' ? result.combo_score : 50;

    return NextResponse.json({
      combo_score: score,
      verdict: score >= 70 ? 'publish' : 'rework',
      one_fix: result.one_fix || 'Improve alignment.',
    });
  } catch (error: any) {
    console.error('Combo error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
