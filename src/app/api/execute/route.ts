import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    // Mapping frontend languages to Piston runtime names
    const runtimeMap: { [key: string]: string } = {
      'cpp': 'cpp',
      'javascript': 'javascript',
      'python': 'python',
    };

    const runtime = runtimeMap[language] || 'cpp';
    const version = runtime === 'cpp' ? '10.2.0' : '*';

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: runtime,
        version: version,
        files: [
          {
            content: code
          }
        ]
      }),
    });

    const data = await response.json();

    if (data.run) {
        // Combine stdout and stderr
        const output = data.run.stdout + (data.run.stderr ? '\nError:\n' + data.run.stderr : '');
        return NextResponse.json({ output: output || 'No output.' });
    }

    return NextResponse.json({ output: 'Execution failed on server.' });

  } catch (error: any) {
    return NextResponse.json({ output: `Server Error: ${error.message}` }, { status: 500 });
  }
}
