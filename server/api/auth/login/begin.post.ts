import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON, deleteJSON } from '../../../utils/storage'

const CHALLENGE_KEY = 'challenge:login'

export async function getLoginChallenge(): Promise<string | null> {
  const data = await readJSON<{ challenge: string } | null>(CHALLENGE_KEY)
  return data?.challenge ?? null
}

export async function clearLoginChallenge(): Promise<void> {
  await deleteJSON(CHALLENGE_KEY)
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

  await writeJSON(CHALLENGE_KEY, { challenge: options.challenge })

  return options
})
