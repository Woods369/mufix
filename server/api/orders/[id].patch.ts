import { requireAuth } from '../../utils/session'
import { readJSON, writeJSON } from '../../utils/storage'
import { isOrderStatus, normalizeOrder, type Order } from '../../utils/orders'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  const orders = await readJSON<any[]>('orders.json')
  const list = Array.isArray(orders) ? orders.map(o => normalizeOrder(o)) : []
  const order = list.find((o: Order) => o.id === id)
  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  if (body.notes !== undefined) {
    order.notes = String(body.notes || '').trim().slice(0, 5000)
  }
  if (body.description !== undefined) {
    order.description = String(body.description || '').trim().slice(0, 2000)
  }
  if (body.product !== undefined) {
    const p = String(body.product || '').trim().slice(0, 200)
    if (!p) throw createError({ statusCode: 400, statusMessage: 'Product name is required' })
    order.product = p
  }
  if (body.status !== undefined) {
    if (!isOrderStatus(body.status)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
    }
    order.status = body.status
  }
  if (body.customerName !== undefined) {
    order.customerName = String(body.customerName || '').trim().slice(0, 200)
  }
  if (body.customerContact !== undefined) {
    order.customerContact = String(body.customerContact || '').trim().slice(0, 200)
  }
  if (body.instrumentType !== undefined) {
    order.instrumentType = String(body.instrumentType || '').trim().slice(0, 100)
  }
  if (body.quoteAmount !== undefined) {
    if (body.quoteAmount === null || body.quoteAmount === '') {
      order.quoteAmount = null
    } else {
      const n = Number(body.quoteAmount)
      if (!Number.isFinite(n) || n < 0) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid quote amount' })
      }
      order.quoteAmount = n
    }
  }

  order.updatedAt = Date.now()
  await writeJSON('orders.json', list)

  return order
})
