import { generateRegistrationOptions } from '@simplewebauthn/server'
import { WEBAUTHN_CONFIG } from '../../../utils/webauthn'

// Store challenge in-memory is OK for single-user; challenge verified immediately after
let _challenge: string = ''

export function getPendingChallenge(): string {
  return _challenge
}

export function clearPendingChallenge(): void {
  _challenge = ''
}

export default defineEventHandler(async () => {
  const options = await generateRegistrationOptions({
    rpName: WEBAUTHN_CONFIG.rpName,
    rpID: WEBAUTHN_CONFIG.rpID,
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
