import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import User from '@/models/User'
import mongoose from 'mongoose'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getEmailQuery(email?: string | null) {
  if (!email) return null
  return { email: { $regex: `^${escapeRegex(email)}$`, $options: 'i' } }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const userId = (session?.user as any)?.id
    if (!email && !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username } = await req.json()
    const leetcode = typeof username === 'string' ? username.trim() : ''
    if (!leetcode) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    await connectDB()
    const idQuery =
      typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)
        ? { _id: userId }
        : null
    const emailQuery = getEmailQuery(email)
    const query = idQuery || emailQuery
    if (!query) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    let user = await User.findOne(query)

    if (!user && email) {
      user = await User.create({
        email,
        name: session?.user?.name || email.split('@')[0],
        role: 'student',
        leetcode,
      })
    } else if (user) {
      user.leetcode = leetcode
      await user.save()
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, leetcode })
  } catch (error) {
    console.error('LeetCode link error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const userId = (session?.user as any)?.id
    if (!email && !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const idQuery =
      typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)
        ? { _id: userId }
        : null
    const emailQuery = getEmailQuery(email)
    const query = idQuery || emailQuery
    if (!query) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await User.updateOne(query, { $unset: { leetcode: 1 } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('LeetCode unlink error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
