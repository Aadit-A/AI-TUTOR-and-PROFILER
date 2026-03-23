// Rate limiting configuration
const MIN_REQUEST_INTERVAL = 4000; // 4 seconds between requests
let lastRequestTime = 0;
let consecutiveRateLimits = 0;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  // Add exponential backoff if we've been rate limited recently
  const backoffMultiplier = Math.min(Math.pow(2, consecutiveRateLimits), 8);
  const requiredInterval = MIN_REQUEST_INTERVAL * backoffMultiplier;
  
  if (timeSinceLastRequest < requiredInterval) {
    const waitTime = requiredInterval - timeSinceLastRequest;
    console.log(`Rate limiter: waiting ${waitTime}ms before next request`);
    await sleep(waitTime);
  }
  
  lastRequestTime = Date.now();
};

export const generateAIResponse = async (prompt: string, codeContext: string) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return "Configuration Error: API Key missing.";

  const cleanKey = apiKey.trim();
  
  // Wait for rate limit before making request
  await waitForRateLimit();
  
  // Construct the prompt
  const fullPrompt = `
You are an expert AI Programming Tutor. Follow these rules strictly:

1. If the user asks for CODE → give ONLY code. No explanation, no comments unless asked. Just clean code.
2. If the user asks for an EXPLANATION → give ONLY an explanation in plain text. No code unless needed to illustrate a point.
3. If the user asks for HINTS → give only hints, not the full solution.
4. If the user asks a general question → answer it directly and concisely.
5. Match the language of the code context when writing code.
6. Never repeat the question back. Never add unnecessary filler.

User's Code:
\`\`\`
${codeContext}
\`\`\`

User's Question: ${prompt}
`;

  // List of model variants to try in order (latest first)
  const models = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite"
  ];

  for (const model of models) {
      try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
          });

          const data = await res.json();

          if (res.ok && data.candidates && data.candidates.length > 0) {
              consecutiveRateLimits = 0; // Reset on success
              return data.candidates[0].content.parts[0].text;
          }
          
          // If rate limited, increase backoff and wait before retry
          if (res.status === 429) {
              consecutiveRateLimits++;
              const waitTime = Math.min(60000, 5000 * Math.pow(2, consecutiveRateLimits));
              console.log(`Rate limited on ${model}, waiting ${waitTime}ms before retry`);
              await sleep(waitTime);
              continue; // Try the same or next model after waiting
          }
      } catch (e) {
          console.log(`Connection failed for ${model}`);
      }
  }

  return "AI connection failed. Please try again in a minute.";
};




