import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Mock HackerRank verification
    // Real API might differ or require scraping if no public API available
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      data: {
        username: username,
        badges: ['Problem Solving', 'Java'],
        points: 500
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify HackerRank account' }, { status: 500 });
  }
}
