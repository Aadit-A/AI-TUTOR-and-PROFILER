import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { prompt, code } = await req.json();
    const response = await generateAIResponse(prompt, code);
    return NextResponse.json({ message: response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
