import type { H3Event } from 'h3'

const SESSION_NAME = 'mufix_sid'
const SESSION_SECRET = process.env.SESSION_SECRET || 'mufix-dev-secret-change-in-prod-123abc!'

export interface SessionData {
  authenticated: boolean
  credentialId: string
}

export async function getSession(event: H3Event): Promise<SessionData | null> {
  const val = getCookie(event, SESSION_NAME)
  if (!val) return null
  try {
    const parsed = JSON.parse(Buffer.from(val, 'base64').toString('utf-8'))
    if (parsed.authenticated && parsed.credentialId) {
      return parsed as SessionData
    }
  } catch {
    // invalid session, ignore
  }
  return null
}

export async function setSession(event: H3Event, data: SessionData): Promise<void> {
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64')
  setCookie(event, SESSION_NAME, encoded, {
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

export function requireAuth(event: H3Event): SessionData {
  const session = getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return session
}
