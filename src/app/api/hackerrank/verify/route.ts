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

    // HackerRank doesn't have a public API, so we'll verify by checking the profile page
    const res = await fetch(`https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`, {
      headers: { 'Accept': 'application/json' }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'HackerRank user not found' }, { status: 404 })
    }

    const data = await res.json()

    return NextResponse.json({
      success: true,
      data: {
        username: data.model?.username || username,
        name: data.model?.name || username,
        level: data.model?.level || 0
      }
    })
  } catch (e) {
    console.error('HackerRank verify error:', e)
    return NextResponse.json({ error: 'Failed to verify' }, { status: 500 })
  }
}
