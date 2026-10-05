import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON } from '../../../utils/storage'
import { setSession } from '../../../utils/session'
import { getLoginChallenge, clearLoginChallenge } from './begin.post'
import { assertRateLimit } from '../../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'auth-login-complete', 20, 60_000)

  const body = await readBody(event)
  const cfg = getWebAuthnConfig(event)
  const expectedChallenge = await getLoginChallenge()

  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: 'No pending login' })
  }

  const credentials = await readJSON<any[]>('credentials.json')
  const list = Array.isArray(credentials) ? credentials : []

  const credential = list.find(c => c.id === body.id)
  if (!credential) {
    await clearLoginChallenge()
    throw createError({ statusCode: 400, statusMessage: 'Unknown credential' })
  }

  let verification
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: cfg.origin,
      expectedRPID: cfg.rpID,
      credential: {
        id: credential.id,
        publicKey: Buffer.from(credential.publicKey, 'base64'),
        counter: credential.counter,
        transports: credential.transports,
      },
      requireUserVerification: false,
    })
  } catch {
    await clearLoginChallenge()
    throw createError({ statusCode: 400, statusMessage: 'Authentication failed' })
  }

  await clearLoginChallenge()

  if (!verification.verified) {
    throw createError({ statusCode: 400, statusMessage: 'Authentication failed' })
  }

  credential.counter = verification.authenticationInfo.newCounter
  await writeJSON('credentials.json', list)

  await setSession(event, {
    authenticated: true,
    credentialId: credential.id,
  })

  return { verified: true }
})
