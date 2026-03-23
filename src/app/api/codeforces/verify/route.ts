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

    const res = await fetch(`https://codeforces.com/api/user.info?handles=${username}`)
    const data = await res.json()

    if (data.status !== 'OK' || !data.result?.[0]) {
      return NextResponse.json({ error: 'Codeforces user not found' }, { status: 404 })
    }

    const user = data.result[0]

    return NextResponse.json({
      success: true,
      data: {
        username: user.handle,
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        rank: user.rank || 'unrated'
      }
    })
  } catch (e) {
    console.error('Codeforces verify error:', e)
    return NextResponse.json({ error: 'Failed to verify' }, { status: 500 })
  }
}
