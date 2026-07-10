import { getSession } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body.product?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Product name is required' })
  }

  const orders = await readJSON<any[]>('orders.json')
  const order = {
    id: randomUUID(),
    product: body.product.trim(),
    description: (body.description || '').trim(),
    notes: (body.notes || '').trim(),
    images: body.images || [],
    createdAt: Date.now(),
  }
  orders.push(order)
  await writeJSON('orders.json', orders)

  return order
})
