import { NextRequest, NextResponse } from 'next/server'

// Rate limiting sederhana (in-memory)
const attempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 menit

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()

  // Cek rate limit
  const attempt = attempts.get(ip)
  if (attempt && attempt.count >= MAX_ATTEMPTS) {
    if (now - attempt.lastAttempt < LOCKOUT_DURATION) {
      const remainingMin = Math.ceil((LOCKOUT_DURATION - (now - attempt.lastAttempt)) / 60000)
      return NextResponse.json(
        { success: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${remainingMin} menit.` },
        { status: 429 }
      )
    }
    // Reset jika lockout sudah lewat
    attempts.delete(ip)
  }

  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (password === adminPassword) {
    attempts.delete(ip) // Reset attempts jika berhasil
    return NextResponse.json({ success: true })
  }

  // Increment attempts
  const current = attempts.get(ip) || { count: 0, lastAttempt: 0 }
  attempts.set(ip, {
    count: current.count + 1,
    lastAttempt: now,
  })

  return NextResponse.json(
    { success: false, message: 'Password salah' },
    { status: 401 }
  )
}