import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LeetCodeProfile from '@/models/LeetCodeProfile';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
             userAvatar
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
        recentAcSubmissionList(username: $username, limit: 3) {
            title
            titleSlug
            timestamp
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (data.errors) {
        return NextResponse.json({ error: 'LeetCode user not found or API error' }, { status: 404 });
    }

    if (!data.data.matchedUser) {
        return NextResponse.json({ error: 'User does not exist on LeetCode' }, { status: 404 });
    }
    
    const userData = data.data.matchedUser;
    const recentSubmissions = data.data.recentAcSubmissionList;

    // Connect to DataBase and Store Data
    await connectDB();
    
    await LeetCodeProfile.findOneAndUpdate(
      { username: userData.username },
      {
        username: userData.username,
        avatar: userData.profile?.userAvatar,
        solvedStats: userData.submitStats.acSubmissionNum,
        recentSubmissions: recentSubmissions,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
        success: true, 
        data: {
            username: userData.username,
            avatar: userData.profile?.userAvatar,
            submitStats: userData.submitStats,
            recentSubmissions: recentSubmissions
        } 
    });

  } catch (error: any) {
    console.error("LeetCode Verify Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
