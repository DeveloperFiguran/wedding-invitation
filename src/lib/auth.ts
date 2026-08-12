import { createHmac, randomBytes } from 'crypto'

const TOKEN_VERSION = 1
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 jam

export interface TokenPayload {
  v: number      // version
  iat: number    // issued at (ms)
  exp: number    // expires at (ms)
  nonce: string  // unique per session
}

// Generate signed token (server only)
export function generateSessionToken(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not configured')
  }

  const now = Date.now()
  const payload: TokenPayload = {
    v: TOKEN_VERSION,
    iat: now,
    exp: now + SESSION_DURATION_MS,
    nonce: randomBytes(16).toString('hex'),
  }

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url')

  return `${payloadStr}.${signature}`
}

// Verify token signature + expiry (server only)
export function verifySessionToken(token: string | null | undefined): {
  valid: boolean
  payload?: TokenPayload
  error?: string
} {
  if (!token) {
    return { valid: false, error: 'No token provided' }
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return { valid: false, error: 'Server misconfigured' }
  }

  // Parse token
  const parts = token.split('.')
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid token format' }
  }

  const [payloadStr, signature] = parts

  // Verify signature (timing-safe)
  const expectedSig = createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url')

  // Timing-safe comparison
  if (expectedSig.length !== signature.length) {
    return { valid: false, error: 'Invalid signature' }
  }

  let mismatch = 0
  for (let i = 0; i < expectedSig.length; i++) {
    mismatch |= expectedSig.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  if (mismatch !== 0) {
    return { valid: false, error: 'Invalid signature' }
  }

  // Decode payload
  try {
    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadStr, 'base64url').toString('utf-8')
    )

    // Check version
    if (payload.v !== TOKEN_VERSION) {
      return { valid: false, error: 'Token version mismatch' }
    }

    // Check expiry
    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Token expired' }
    }

    // Check iat is reasonable (not future)
    if (payload.iat > Date.now() + 60000) {
      return { valid: false, error: 'Token issued in future' }
    }

    return { valid: true, payload }
  } catch {
    return { valid: false, error: 'Invalid payload' }
  }
}

// Check password dengan constant-time comparison
export function verifyPassword(input: string, stored: string): boolean {
  if (!input || !stored) return false
  if (input.length !== stored.length) return false

  let mismatch = 0
  for (let i = 0; i < stored.length; i++) {
    mismatch |= input.charCodeAt(i) ^ stored.charCodeAt(i)
  }
  return mismatch === 0
}