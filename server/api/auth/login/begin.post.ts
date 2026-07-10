import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON } from '../../../utils/storage'

let _challenge: string = ''

export function getLoginChallenge(): string {
  return _challenge
}

export function clearLoginChallenge(): void {
  _challenge = ''
}

export default defineEventHandler(async (event) => {
  const cfg = getWebAuthnConfig(event)
  const credentials = await readJSON<any[]>('credentials.json')

  const options = await generateAuthenticationOptions({
    rpID: cfg.rpID,
    // Empty allowCredentials = discoverable credential; Flipper picks the right one
    allowCredentials: credentials.length > 0
      ? credentials.map(c => ({
          id: c.id,
          transports: c.transports ?? [],
        }))
      : [],
    userVerification: 'discouraged',
  })

  _challenge = options.challenge

  return options
})
