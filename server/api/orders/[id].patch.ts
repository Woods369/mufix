import { getSession } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

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
