type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (existing.count >= limit) return false
  existing.count += 1
  return true
}

export function clientKey(event: any, prefix: string): string {
  try {
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    return `${prefix}:${ip}`
  } catch {
    return `${prefix}:unknown`
  }
}

export function assertRateLimit(event: any, prefix: string, limit: number, windowMs: number) {
  if (!rateLimit(clientKey(event, prefix), limit, windowMs)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests. Try again shortly.' })
  }
}
