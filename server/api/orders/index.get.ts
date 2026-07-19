import { requireAuth } from '../../utils/session'
import { readJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const orders = await readJSON<any[]>('orders.json')
  return orders.sort((a, b) => b.createdAt - a.createdAt)
})
