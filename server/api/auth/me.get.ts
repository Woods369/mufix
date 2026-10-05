import { getSession } from '../../utils/session'
import { readJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  const credentials = await readJSON<any[]>('credentials.json')
  const list = Array.isArray(credentials) ? credentials : []

  return {
    authenticated: !!session,
    hasCredential: list.length > 0,
    registrationOpen: list.length === 0 || process.env.ALLOW_WEBAUTHN_REREGISTER === 'true',
  }
})
