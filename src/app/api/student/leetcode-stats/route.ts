import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import LeetCodeProfile from '@/models/LeetCodeProfile';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.leetcode) {
      return NextResponse.json({ error: 'Not authenticated or LeetCode not linked' }, { status: 401 });
    }

    await connectDB();
    
    const profile = await LeetCodeProfile.findOne({ username: session.user.leetcode });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Dashboard Profile Fetch Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
