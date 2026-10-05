import { requireAuth } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'
import { normalizeOrder, type Order } from '../../utils/orders'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  const orders = await readJSON<any[]>('orders.json')
  const list = Array.isArray(orders) ? orders.map(o => normalizeOrder(o)) : []
  const idx = list.findIndex((o: Order) => o.id === id)
  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  list.splice(idx, 1)
  await writeJSON('orders.json', list)

  return { ok: true }
})
