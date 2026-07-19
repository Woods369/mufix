import { requireAuth } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  const orders = await readJSON<any[]>('orders.json')
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  orders.splice(idx, 1)
  await writeJSON('orders.json', orders)

  return { ok: true }
})
