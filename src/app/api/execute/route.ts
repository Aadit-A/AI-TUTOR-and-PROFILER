import { NextResponse } from 'next/server'

const JUDGE0_BASE_URL = (process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com').trim()
const REQUEST_TIMEOUT_MS = 30000
const CPP_LANGUAGE_ID = 54

const toBase64 = (value: string) => Buffer.from(value, 'utf8').toString('base64')

const decodeMaybeBase64 = (value: unknown): string => {
  if (typeof value !== 'string' || !value) return ''

  const text = value.trim()
  const compact = text.replace(/\s+/g, '')

  // Judge0 returns base64 strings when base64_encoded=true.
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(compact) && compact.length % 4 === 0) {
    try {
      return Buffer.from(compact, 'base64').toString('utf8').trim()
    } catch {
      return text
    }
  }

  return text
}

const executeWithJudge0 = async (code: string, languageId: number, input: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(
      `${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=true`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          source_code: toBase64(code),
          language_id: languageId,
          stdin: toBase64(input),
        }),
      }
    )

    const rawBody = await response.text()
    let data: any = null

    try {
      data = rawBody ? JSON.parse(rawBody) : null
    } catch {
      throw new Error(rawBody || 'Invalid compiler response')
    }

    if (!response.ok) {
      const apiMessage = data?.message || data?.error || rawBody || `HTTP ${response.status}`
      throw new Error(String(apiMessage))
    }

    return data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Compiler request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function POST(req: Request) {
  try {
    const { code, input = '' } = await req.json()

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 })
    }

    // Auto-append a main() if one doesn't exist so the code compiles.
    let finalCode = code
    if (!/\bmain\s*\(/.test(code)) {
      finalCode = code + '\n\nint main() {\n    // Add your test code here\n    return 0;\n}\n'
    }

    const data = await executeWithJudge0(finalCode, CPP_LANGUAGE_ID, input)

    const compileOutput = decodeMaybeBase64(data?.compile_output)
    const stderr = decodeMaybeBase64(data?.stderr)
    const stdout = decodeMaybeBase64(data?.stdout)
    const message = decodeMaybeBase64(data?.message)
    const statusDescription = typeof data?.status?.description === 'string' ? data.status.description : ''

    if (compileOutput) {
      return NextResponse.json({ output: `Compilation Error:\n${compileOutput}` })
    }

    if (stderr) {
      return NextResponse.json({ output: `Runtime Error:\n${stderr}` })
    }

    if (message) {
      return NextResponse.json({ output: `Error: ${message}` })
    }

    return NextResponse.json({ output: stdout || statusDescription || 'No output' })
  } catch (e: any) {
    console.error('Execute error:', e)
    return NextResponse.json({ output: `Execution failed: ${e.message}` }, { status: 500 })
  }
}
