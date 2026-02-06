import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'No API Key found in environment' });
  }

  const testPrompt = "Say hello in one word.";

  const models = ["gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-2.0-pro-exp", "gemini-exp-1206"];
  const results: any[] = [];

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: testPrompt }] }] })
      });
      
      const data = await res.json();
      
      results.push({
        model,
        status: res.status,
        ok: res.ok,
        response: res.ok ? data.candidates?.[0]?.content?.parts?.[0]?.text : data.error
      });

      // If one works, we can stop
      if (res.ok) break;

    } catch (e: any) {
      results.push({ model, error: e.message });
    }
  }

  return NextResponse.json({
    keyPreview: apiKey.substring(0, 10) + '...',
    results
  });
}
