export const runtime = 'nodejs';

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
          content: `You are a YouTube packaging expert. Analyze how the thumbnail image and video title work TOGETHER as a package.

Return ONLY a JSON object in this exact format:
{
  "combo_score": 72,
  "verdict": "publish",
  "one_fix": "Add a subtle arrow pointing to the key element."
}

Rules:
- combo_score must be a number 0-100
- verdict must be exactly "publish" or "rework"
- If score >= 70, verdict MUST be "publish"
- If score < 70, verdict MUST be "rework"`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Video title: "${title}"` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || '{}';
    
    let result: any = {};
    try {
      result = JSON.parse(content.replace(/```json|```/g, '').trim());
    } catch {
      result = {};
    }

    const score = typeof result.combo_score === 'number' ? result.combo_score : 50;
    const verdict = score >= 70 ? 'publish' : 'rework';

    return NextResponse.json({
      combo_score: score,
      verdict,
      one_fix: result.one_fix || 'Improve title-thumbnail alignment.',
    });
  } catch (error: any) {
    console.error('Combo API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
