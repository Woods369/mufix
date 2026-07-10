import type { H3Event } from 'h3'

export const RP_NAME = 'Mufix'

/**
 * Derive RP ID and origin from the request host.
 * Handles: localhost, Vercel preview URLs (*.vercel.app), and custom domains.
 */
export function getWebAuthnConfig(event: H3Event) {
  const host = getRequestHost(event, { xForwardedHost: true })
  const protocol = getRequestProtocol(event)
  return {
    rpName: RP_NAME,
    rpID: host,
    origin: `${protocol}://${host}`,
  }
}
