import type { H3Event } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { requireProdSecret } from './env'

const SESSION_NAME = 'mufix_sid'
const DEV_FALLBACK = 'mufix-dev-secret-change-in-prod-123abc!'

export interface SessionData {
  authenticated: boolean
  credentialId: string
}

function getSecret(): string {
  return requireProdSecret('SESSION_SECRET', process.env.SESSION_SECRET, DEV_FALLBACK)
}

function signPayload(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

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
    // invalid session
  }
  return null
}

export async function setSession(event: H3Event, data: SessionData): Promise<void> {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64')
  const sig = signPayload(payload)
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
  setCookie(event, SESSION_NAME, `${payload}.${sig}`, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14,
    secure: isProd,
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
