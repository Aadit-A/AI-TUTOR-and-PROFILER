import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const buildPrompt = (prompt: string, codeContext: string): string => `
You are an expert AI Programming Tutor. Follow these rules strictly:

1. If the user asks for CODE -> give ONLY code. No explanation, no comments unless asked. Just clean code.
2. If the user asks for an EXPLANATION -> give ONLY an explanation in plain text. No code unless needed to illustrate a point.
3. If the user asks for HINTS -> give only hints, not the full solution.
4. If the user asks a general question -> answer it directly and concisely.
5. Match the language of the code context when writing code.
6. Never repeat the question back. Never add unnecessary filler.

User's Code:
\`\`\`
${codeContext}
\`\`\`

User's Question: ${prompt}
`;

export async function POST(req: Request) {
  try {
    const { prompt, code } = await req.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'Groq API Key not configured' }, { status: 500 });
    }

    const fullPrompt = buildPrompt(prompt, code || '');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and concise AI Programming Tutor. You provide clear explanations, code snippets, and hints as requested.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || 'No response from AI';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('AI Tutor API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to connect to AI Tutor' 
    }, { status: 500 });
  }
}
