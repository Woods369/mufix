import { getSession } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

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
