import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function calculateRealisticScore(metrics: any): number {
  const {
    contrast = 0,
    textReadability = 0,
    focalPoint = 0,
    colorBalance = 0,
    composition = 0,
  } = metrics;

  if (contrast < 10 && textReadability < 5 && focalPoint < 5) {
    return Math.floor(Math.random() * 10) + 5;
  }

  let score = 0;
  score += Math.min(contrast, 100) * 0.30;
  score += Math.min(textReadability, 100) * 0.25;
  score += Math.min(focalPoint, 100) * 0.20;
  score += Math.min(colorBalance, 100) * 0.15;
  score += Math.min(composition, 100) * 0.10;

  if (textReadability < 20 && focalPoint < 20) score = Math.min(score, 45);
  if (contrast < 20) score = Math.min(score, 55);

  return Math.round(score);
}

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert YouTube thumbnail analyst. 
Analyze the image and return ONLY a JSON object in this exact format:
{
  "metrics": {
    "contrast": number (0-100),
    "textReadability": number (0-100),
    "focalPoint": number (0-100),
    "colorBalance": number (0-100),
    "composition": number (0-100)
  },
  "recommendations": string[]
}

SCORING RULES (be honest and strict):
- Solid color / blank image: contrast=5, textReadability=0, focalPoint=0
- Cluttered with tiny text: textReadability=10-20
- No focal point: focalPoint=5-15
- Good thumbnail: contrast 70+, textReadability 60+, focalPoint 60+
- Excellent thumbnail: all metrics 75+`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this YouTube thumbnail strictly. Be honest about flaws."
            },
            {
              type: "image_url",
              image_url: {
                url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`
              }
            }
          ]
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || "{}";
    const cleanContent = content.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleanContent);

    const score = calculateRealisticScore(result.metrics);

    return NextResponse.json({
      score,
      metrics: result.metrics,
      recommendations: result.recommendations || [],
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { 
        error: "Analysis failed", 
        details: error?.message || "Unknown error",
        score: 0, 
        recommendations: [] 
      },
      { status: 500 }
    );
  }
}
