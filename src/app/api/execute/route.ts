import { NextResponse } from 'next/server'

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  java: { language: 'java', version: '15.0.2' },
}

export async function POST(req: Request) {
  try {
    const { code, language = 'cpp', input = '' } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 })
    }

    const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP.cpp

    // For C/C++, auto-append a main() if one doesn't exist so the code compiles
    let finalCode = code
    if ((language === 'cpp' || language === 'c') && !/\bmain\s*\(/.test(code)) {
      finalCode = code + '\n\nint main() {\n    // Add your test code here\n    return 0;\n}\n'
    }

    // Using Piston API (free, no API key required)
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: finalCode }],
        stdin: input
      })
    })

    const data = await response.json()

    if (data.message) {
      return NextResponse.json({ output: `Error: ${data.message}` })
    }

    const output = data.run?.output || data.compile?.output || 'No output'
    const stderr = data.run?.stderr || data.compile?.stderr || ''

    return NextResponse.json({ 
      output: stderr ? `${output}\n\nErrors:\n${stderr}` : output
    })
  } catch (e: any) {
    console.error('Execute error:', e)
    return NextResponse.json({ output: `Execution failed: ${e.message}` }, { status: 500 })
  }
}
