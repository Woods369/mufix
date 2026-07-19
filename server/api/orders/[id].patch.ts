import { requireAuth } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (body.notes === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'notes field is required' })
  }

  const orders = await readJSON<any[]>('orders.json')
  const order = orders.find(o => o.id === id)
  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  order.notes = (body.notes || '').trim()
  await writeJSON('orders.json', orders)

  return order
})
