import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON } from '../../../utils/storage'
import { getPendingChallenge, clearPendingChallenge } from './begin.post'
import { assertRateLimit } from '../../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'auth-register-complete', 10, 60_000)

  const body = await readBody(event)
  const cfg = getWebAuthnConfig(event)
  const expectedChallenge = await getPendingChallenge()

  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: 'No pending registration' })
  }

  // Re-check lock in case another request registered first
  const existing = await readJSON<any[]>('credentials.json')
  const list = Array.isArray(existing) ? existing : []
  if (list.length > 0 && process.env.ALLOW_WEBAUTHN_REREGISTER !== 'true') {
    await clearPendingChallenge()
    throw createError({ statusCode: 403, statusMessage: 'Registration is locked' })
  }

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: cfg.origin,
      expectedRPID: cfg.rpID,
      requireUserVerification: false,
    })
  } catch {
    await clearPendingChallenge()
    throw createError({ statusCode: 400, statusMessage: 'Registration verification failed' })
  }

  await clearPendingChallenge()

  if (!verification.verified || !verification.registrationInfo) {
    throw createError({ statusCode: 400, statusMessage: 'Registration verification failed' })
  }

  const reg = verification.registrationInfo
  const credential = {
    id: reg.credential.id,
    publicKey: Buffer.from(reg.credential.publicKey).toString('base64'),
    counter: reg.credential.counter,
    transports: reg.credential.transports ?? [],
  }

  await writeJSON('credentials.json', [credential])

  return { verified: true }
})
