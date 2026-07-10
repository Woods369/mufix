import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON } from '../../../utils/storage'
import { setSession } from '../../../utils/session'
import { getLoginChallenge, clearLoginChallenge } from './begin.post'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const cfg = getWebAuthnConfig(event)
  const expectedChallenge = getLoginChallenge()

  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: 'No pending login' })
  }

  const credentials = await readJSON<any[]>('credentials.json')

  // Find the credential by ID (body.id is base64-encoded credential ID)
  const credential = credentials.find(c => c.id === body.id)
  if (!credential) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown credential' })
  }

  const verification = await verifyAuthenticationResponse({
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

  clearLoginChallenge()

  if (!verification.verified) {
    throw createError({ statusCode: 400, statusMessage: 'Authentication failed' })
  }

  // Update counter
  credential.counter = verification.authenticationInfo.newCounter
  await writeJSON('credentials.json', credentials)

  // Set session
  await setSession(event, {
    authenticated: true,
    credentialId: credential.id,
  })

  return { verified: true }
})
