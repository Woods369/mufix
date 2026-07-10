import { generateRegistrationOptions } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'

// Store challenge in-memory is OK for single-user; challenge verified immediately after
let _challenge: string = ''

export function getPendingChallenge(): string {
  return _challenge
}

export function clearPendingChallenge(): void {
  _challenge = ''
}

export default defineEventHandler(async (event) => {
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

  _challenge = options.challenge

  return options
})
