import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if already signed up
    const exists = await kv.sismember('waitlist:emails', normalizedEmail)
    if (exists) {
      return NextResponse.json({
        success: true,
        isNew: false,
        message: 'Already on the list',
      })
    }

    // Store email with timestamp
    const entry = {
      email: normalizedEmail,
      signedUpAt: new Date().toISOString(),
    }

    // Add to sorted set (for ordered retrieval) and set (for dedup)
    await kv.zadd('waitlist', {
      score: Date.now(),
      member: JSON.stringify(entry),
    })
    await kv.sadd('waitlist:emails', normalizedEmail)

    return NextResponse.json({
      success: true,
      isNew: true,
    })
  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    )
  }
}

// GET endpoint to view waitlist (protected)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.WAITLIST_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const count = await kv.scard('waitlist:emails')
    const emails = await kv.smembers('waitlist:emails')

    return NextResponse.json({
      count,
      emails,
    })
  } catch (error) {
    console.error('Waitlist fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    )
  }
}
