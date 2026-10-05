export const ORDER_STATUSES = [
  'intake',
  'diagnosing',
  'quoted',
  'approved',
  'in_repair',
  'ready',
  'returned',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface Order {
  id: string
  product: string
  description: string
  notes: string
  images: string[]
  status: OrderStatus
  customerName: string
  customerContact: string
  instrumentType: string
  quoteAmount: number | null
  createdAt: number
  updatedAt: number
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && (ORDER_STATUSES as readonly string[]).includes(value)
}

export function normalizeOrder(raw: Partial<Order> & { id: string; product: string; createdAt: number }): Order {
  return {
    id: raw.id,
    product: raw.product,
    description: raw.description || '',
    notes: raw.notes || '',
    images: Array.isArray(raw.images) ? raw.images.filter(u => typeof u === 'string') : [],
    status: isOrderStatus(raw.status) ? raw.status : 'intake',
    customerName: raw.customerName || '',
    customerContact: raw.customerContact || '',
    instrumentType: raw.instrumentType || '',
    quoteAmount: typeof raw.quoteAmount === 'number' && Number.isFinite(raw.quoteAmount) ? raw.quoteAmount : null,
    createdAt: raw.createdAt,
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : raw.createdAt,
  }
}
