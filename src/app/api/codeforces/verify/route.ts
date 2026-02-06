import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result || data.result.length === 0) {
       return NextResponse.json({ error: 'User not found on Codeforces' }, { status: 404 });
    }

    const user = data.result[0];

    return NextResponse.json({
      data: {
        username: user.handle,
        rating: user.rating,
        rank: user.rank,
        avatar: user.titlePhoto
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify Codeforces account' }, { status: 500 });
  }
}
