import { requireAuth } from '../../utils/session'
import { readJSON } from '../../utils/storage'
import { normalizeOrder, type Order } from '../../utils/orders'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const raw = await readJSON<any[]>('orders.json')
  const list = (Array.isArray(raw) ? raw : []).map(o => normalizeOrder(o))
  return list.sort((a: Order, b: Order) => b.createdAt - a.createdAt)
})
