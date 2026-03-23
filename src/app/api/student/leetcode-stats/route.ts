import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const username = (session.user as any)?.leetcode
    if (!username) {
      return NextResponse.json({ error: 'No LeetCode account linked' }, { status: 400 })
    }

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
        }
        recentSubmissionList(username: $username, limit: 10) {
          title
          statusDisplay
          timestamp
          lang
        }
      }
    `

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    })

    const data = await res.json()
    
    if (!data.data?.matchedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = data.data.matchedUser
    const submissions = user.submitStats.acSubmissionNum
    const easy = submissions.find((s: any) => s.difficulty === 'Easy')?.count || 0
    const medium = submissions.find((s: any) => s.difficulty === 'Medium')?.count || 0
    const hard = submissions.find((s: any) => s.difficulty === 'Hard')?.count || 0

    return NextResponse.json({
      success: true,
      data: {
        username: user.username,
        easy,
        medium,
        hard,
        total: easy + medium + hard,
        ranking: user.profile?.ranking || 0,
        recentSubmissions: data.data.recentSubmissionList || []
      }
    })
  } catch (e) {
    console.error('LeetCode stats error:', e)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
