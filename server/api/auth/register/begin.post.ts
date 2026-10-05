import { generateRegistrationOptions } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON, deleteJSON } from '../../../utils/storage'
import { assertRateLimit } from '../../../utils/rateLimit'
import { isProductionRuntime } from '../../../utils/env'

const CHALLENGE_KEY = 'challenge:register'

export async function getPendingChallenge(): Promise<string | null> {
  const data = await readJSON<{ challenge: string } | null>(CHALLENGE_KEY)
  return data?.challenge ?? null
}

export async function clearPendingChallenge(): Promise<void> {
  await deleteJSON(CHALLENGE_KEY)
}

function assertRegistrationAllowed(event: any, credentials: any[]) {
  const list = Array.isArray(credentials) ? credentials : []
  const allowReregister = process.env.ALLOW_WEBAUTHN_REREGISTER === 'true'
  if (list.length > 0 && !allowReregister) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Registration is locked. A security key is already registered.',
    })
  }

  const regSecret = process.env.REGISTER_SECRET
  if (regSecret) {
    const header = getHeader(event, 'x-register-secret') || ''
    const query = getQuery(event)
    const q = typeof query.secret === 'string' ? query.secret : ''
    if (header !== regSecret && q !== regSecret) {
      throw createError({ statusCode: 403, statusMessage: 'Invalid registration secret' })
    }
  } else if (isProductionRuntime() && list.length === 0) {
    // First-time prod register still allowed once, but recommend REGISTER_SECRET
    // No hard fail — lock after first credential is the main control.
  }
}

export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'auth-register-begin', 10, 60_000)

  const credentials = await readJSON<any[]>('credentials.json')
  assertRegistrationAllowed(event, credentials)

  const cfg = getWebAuthnConfig(event)
  const options = await generateRegistrationOptions({
    rpName: cfg.rpName,
    rpID: cfg.rpID,
    userName: 'mufix-admin',
    userDisplayName: 'Mufix Admin',
    authenticatorSelection: {
      residentKey: 'preferred',
      authenticatorAttachment: 'cross-platform',
      userVerification: 'discouraged',
    },
    attestationType: 'none',
  })

  await writeJSON(CHALLENGE_KEY, { challenge: options.challenge, createdAt: Date.now() })

  return options
})
