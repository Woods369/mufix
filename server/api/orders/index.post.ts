import { requireAuth } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'
import { randomUUID } from 'node:crypto'
import { assertRateLimit } from '../../utils/rateLimit'
import { isOrderStatus, normalizeOrder, type Order } from '../../utils/orders'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  assertRateLimit(event, 'orders-post', 30, 60_000)

  const body = await readBody(event)
  if (!body?.product || typeof body.product !== 'string' || !body.product.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Product name is required' })
  }

  const images = Array.isArray(body.images)
    ? body.images.filter((u: unknown) => typeof u === 'string' && u.length < 500_000).slice(0, 12)
    : []

  let quoteAmount: number | null = null
  if (body.quoteAmount !== undefined && body.quoteAmount !== null && body.quoteAmount !== '') {
    const n = Number(body.quoteAmount)
    if (!Number.isFinite(n) || n < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid quote amount' })
    }
    quoteAmount = n
  }

  const now = Date.now()
  const order = normalizeOrder({
    id: randomUUID(),
    product: body.product.trim().slice(0, 200),
    description: String(body.description || '').trim().slice(0, 2000),
    notes: String(body.notes || '').trim().slice(0, 5000),
    images,
    status: isOrderStatus(body.status) ? body.status : 'intake',
    customerName: String(body.customerName || '').trim().slice(0, 200),
    customerContact: String(body.customerContact || '').trim().slice(0, 200),
    instrumentType: String(body.instrumentType || '').trim().slice(0, 100),
    quoteAmount,
    createdAt: now,
    updatedAt: now,
  })

  const orders = await readJSON<Order[]>('orders.json')
  const list = Array.isArray(orders) ? orders : []
  list.push(order)
  await writeJSON('orders.json', list)

  return order
})
