import { getSession } from '../../utils/session'
import { readJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const orders = await readJSON<any[]>('orders.json')
  return orders.sort((a, b) => b.createdAt - a.createdAt)
})
