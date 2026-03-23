import { NextResponse } from 'next/server';
import { judge } from '@/lib/judge';

export async function POST(req: Request) {
  try {
    const { problemId, code } = await req.json();
    if (!problemId || !code) return NextResponse.json({ error: 'problemId and code required' }, { status: 400 });
    return NextResponse.json(await judge(Number(problemId), code));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
