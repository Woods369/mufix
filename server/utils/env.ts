/**
 * Fail fast in production when critical secrets are missing.
 * Call from handlers that need a real secret (session, registration gate).
 */
export function requireProdSecret(name: string, value: string | undefined, devFallback?: string): string {
  if (value && value.length >= 16) return value
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    throw createError({
      statusCode: 500,
      statusMessage: `${name} must be set to a strong value in production`,
    })
  }
  if (devFallback) return devFallback
  throw createError({
    statusCode: 500,
    statusMessage: `${name} is not configured`,
  })
}

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
}
