import { getSession } from '../../utils/session'
import { readJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  const credentials = await readJSON<any[]>('credentials.json')

  return {
    authenticated: !!session,
    hasCredential: credentials.length > 0,
  }
})
