import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON } from '../../../utils/storage'
import { getPendingChallenge, clearPendingChallenge } from './begin.post'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const cfg = getWebAuthnConfig(event)
  const expectedChallenge = getPendingChallenge()

  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: 'No pending registration' })
  }

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge,
    expectedOrigin: cfg.origin,
    expectedRPID: cfg.rpID,
    requireUserVerification: false,
  })

  clearPendingChallenge()

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

  // Store credential — replace any existing (single-user, one Flipper)
  await writeJSON('credentials.json', [credential])

  return { verified: true }
})
