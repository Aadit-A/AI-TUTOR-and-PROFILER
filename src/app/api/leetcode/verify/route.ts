import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { username } = await req.json()
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
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
            realName
            ranking
          }
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
      return NextResponse.json({ error: 'LeetCode user not found' }, { status: 404 })
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
        realName: user.profile?.realName,
        ranking: user.profile?.ranking,
        easy,
        medium,
        hard,
        total: easy + medium + hard
      }
    })
  } catch (e) {
    console.error('LeetCode verify error:', e)
    return NextResponse.json({ error: 'Failed to verify' }, { status: 500 })
  }
}
