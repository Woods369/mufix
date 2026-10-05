import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON, deleteJSON } from '../../../utils/storage'
import { assertRateLimit } from '../../../utils/rateLimit'

const CHALLENGE_KEY = 'challenge:login'

export async function getLoginChallenge(): Promise<string | null> {
  const data = await readJSON<{ challenge: string } | null>(CHALLENGE_KEY)
  return data?.challenge ?? null
}

export async function clearLoginChallenge(): Promise<void> {
  await deleteJSON(CHALLENGE_KEY)
}

export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'auth-login-begin', 20, 60_000)

  const cfg = getWebAuthnConfig(event)
  const credentials = await readJSON<any[]>('credentials.json')
  const list = Array.isArray(credentials) ? credentials : []

  const options = await generateAuthenticationOptions({
    rpID: cfg.rpID,
    allowCredentials: list.length > 0
      ? list.map(c => ({
          id: c.id,
          transports: c.transports ?? [],
        }))
      : [],
    userVerification: 'discouraged',
  })

  await writeJSON(CHALLENGE_KEY, { challenge: options.challenge, createdAt: Date.now() })

  return options
})
