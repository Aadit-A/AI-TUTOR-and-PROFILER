import { NextResponse } from 'next/server';

const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
const DEFAULT_OLLAMA_MODEL = 'qwen3.5';
const OLLAMA_TIMEOUT_MS = 45000;
const OLLAMA_FALLBACK_BASE_URLS = [
  DEFAULT_OLLAMA_BASE_URL,
  'http://localhost:11434',
  'http://127.0.0.1:11435'
];

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

const toErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const normalizeBaseUrl = (url: string): string => {
  return url.trim().replace(/\/+$/, '');
};

const shouldRetryWithAnotherUrl = (error: unknown): boolean => {
  const message = toErrorMessage(error).toLowerCase();
  return (
    message.includes('fetch failed') ||
    message.includes('econnrefused') ||
    message.includes('network') ||
    message.includes('timed out') ||
    message.includes('aborterror')
  );
};

const buildBaseUrlCandidates = (configuredBaseUrl: string): string[] => {
  const candidates = [configuredBaseUrl, ...OLLAMA_FALLBACK_BASE_URLS].map(normalizeBaseUrl);
  return [...new Set(candidates.filter(Boolean))];
};

const generateWithOllama = async (
  baseUrl: string,
  model: string,
  fullPrompt: string
): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        think: false,
        messages: [{ role: 'user', content: fullPrompt }]
      })
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${OLLAMA_TIMEOUT_MS / 1000}s.`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const rawBody = await response.text();
  let data: { error?: string; message?: { content?: string } } | null = null;

  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const apiMessage = data?.error || rawBody || `HTTP ${response.status}`;
    if (typeof apiMessage === 'string' && apiMessage.toLowerCase().includes('model')) {
      throw new Error(`${apiMessage} Run: ollama pull ${model}`);
    }
    throw new Error(String(apiMessage));
  }

  const content = data?.message?.content;
  if (typeof content === 'string' && content.trim()) {
    return content;
  }

  throw new Error('Ollama returned an empty response.');
};

const generateAIResponse = async (prompt: string, codeContext: string): Promise<string> => {
  const fullPrompt = buildPrompt(prompt, codeContext);
  const configuredBaseUrl = normalizeBaseUrl(
    process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL
  );
  const model = (process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL).trim();
  const baseUrlCandidates = buildBaseUrlCandidates(configuredBaseUrl);

  let lastError: unknown = null;

  for (const baseUrl of baseUrlCandidates) {
    try {
      return await generateWithOllama(baseUrl, model, fullPrompt);
    } catch (error) {
      lastError = error;
      if (!shouldRetryWithAnotherUrl(error)) {
        return `AI request failed at ${baseUrl}. ${toErrorMessage(error)}`;
      }
    }
  }

  const tried = baseUrlCandidates.join(', ');
  const details = lastError ? toErrorMessage(lastError) : 'Unknown connection error.';
  return `AI connection failed. Could not reach Ollama. Tried ${tried}. ${details}. Start Ollama with: ollama serve`;
};

export async function POST(req: Request) {
  try {
    const { prompt, code } = await req.json();
    const response = await generateAIResponse(prompt, code);
    return NextResponse.json({ message: response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
