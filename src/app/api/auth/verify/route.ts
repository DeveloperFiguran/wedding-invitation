import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null

    const result = verifySessionToken(token)

    if (!result.valid) {
      return NextResponse.json(
        { authenticated: false, error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      expiresAt: result.payload!.exp,
      expiresIn: result.payload!.exp - Date.now(),
    })
  } catch (err) {
    return NextResponse.json(
      { authenticated: false, error: 'Server error' },
      { status: 500 }
    )
  }
}