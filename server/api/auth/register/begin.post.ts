import { generateRegistrationOptions } from '@simplewebauthn/server'
import { getWebAuthnConfig } from '../../../utils/webauthn'
import { readJSON, writeJSON, deleteJSON } from '../../../utils/storage'

const CHALLENGE_KEY = 'challenge:register'

export async function getPendingChallenge(): Promise<string | null> {
  const data = await readJSON<{ challenge: string } | null>(CHALLENGE_KEY)
  return data?.challenge ?? null
}

export async function clearPendingChallenge(): Promise<void> {
  await deleteJSON(CHALLENGE_KEY)
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

  await writeJSON(CHALLENGE_KEY, { challenge: options.challenge })

  return options
})
