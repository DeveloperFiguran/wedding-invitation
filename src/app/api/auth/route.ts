import { NextRequest, NextResponse } from 'next/server'
import { generateSessionToken, verifyPassword } from '@/lib/auth'

// Simple rate limiting (production sebaiknya pakai Redis/Upstash)
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 menit

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + LOCKOUT_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: LOCKOUT_MS }
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetIn: record.resetAt - now }
  }

  record.count++
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count, resetIn: record.resetAt - now }
}

function resetRateLimit(ip: string) {
  attempts.delete(ip)
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(ip)

    if (!rateLimit.allowed) {
      const minutes = Math.ceil(rateLimit.resetIn / 60000)
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.`,
          locked: true,
        },
        { status: 429 }
      )
    }

    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not configured')
      return NextResponse.json(
        { success: false, message: 'Server misconfigured' },
        { status: 500 }
      )
    }

    // Constant-time password verification
    if (typeof password !== 'string' || !verifyPassword(password, adminPassword)) {
      return NextResponse.json(
        {
          success: false,
          message: `Password salah. ${rateLimit.remaining} percobaan tersisa.`,
          remaining: rateLimit.remaining,
        },
        { status: 401 }
      )
    }

    // Success - reset rate limit & generate token
    resetRateLimit(ip)
    const token = generateSessionToken()

    return NextResponse.json({
      success: true,
      token,
      expiresIn: 24 * 60 * 60 * 1000, // 24 jam
    })
  } catch (err: any) {
    console.error('Auth error:', err)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}