import type { H3Event } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'

const SESSION_NAME = 'mufix_sid'
const SESSION_SECRET = process.env.SESSION_SECRET || 'mufix-dev-secret-change-in-prod-123abc!'

export interface SessionData {
  authenticated: boolean
  credentialId: string
}

/**
 * Sign a base64 payload with HMAC-SHA256 using SESSION_SECRET.
 * Returns a hex digest.
 */
function signPayload(payload: string): string {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
}

/**
 * Constant-time signature comparison to prevent timing attacks.
 */
function verifySignature(payload: string, sig: string): boolean {
  const expected = signPayload(payload)
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(sig, 'hex'))
  } catch {
    return false
  }
}

export async function getSession(event: H3Event): Promise<SessionData | null> {
  const val = getCookie(event, SESSION_NAME)
  if (!val) return null
  try {
    // Cookie format: <base64_payload>.<hmac_hex>
    const dotIdx = val.lastIndexOf('.')
    if (dotIdx === -1) return null

    const payload = val.slice(0, dotIdx)
    const sig = val.slice(dotIdx + 1)

    if (!verifySignature(payload, sig)) return null

    const parsed = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
    if (parsed.authenticated && parsed.credentialId) {
      return parsed as SessionData
    }
  } catch {
    // invalid session, ignore
  }
  return null
}

export async function setSession(event: H3Event, data: SessionData): Promise<void> {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64')
  const sig = signPayload(payload)
  setCookie(event, SESSION_NAME, `${payload}.${sig}`, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function clearSession(event: H3Event): Promise<void> {
  deleteCookie(event, SESSION_NAME, { path: '/' })
}

export async function requireAuth(event: H3Event): Promise<SessionData> {
  const session = await getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return session
}
