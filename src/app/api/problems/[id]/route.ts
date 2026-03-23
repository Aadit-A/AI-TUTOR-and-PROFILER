import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Problem from '@/models/Problem';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const problemId = parseInt(id);
    
    if (isNaN(problemId)) {
      return NextResponse.json(
        { error: 'Invalid problem ID' },
        { status: 400 }
      );
    }
    
    const problem = await Problem.findOne({ problemId }).lean();
    
    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Convert starterCode Map to plain object for JSON
    const sc = problem.starterCode;
    let starterCode: Record<string, string> = {};
    if (sc) {
      if (sc instanceof Map) {
        sc.forEach((v: string, k: string) => { starterCode[k] = v; });
      } else if (typeof sc === 'object') {
        starterCode = sc as any;
      }
    }

    return NextResponse.json({ ...problem, starterCode });
    
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}
