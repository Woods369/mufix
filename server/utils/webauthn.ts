import type { H3Event } from 'h3'

export const RP_NAME = 'Mufix'

/**
 * Prefer pinned WEBAUTHN_RP_ID + WEBAUTHN_ORIGIN in production.
 * Falls back to request host for local / preview.
 */
export function getWebAuthnConfig(event: H3Event) {
  const envRp = process.env.WEBAUTHN_RP_ID
  const envOrigin = process.env.WEBAUTHN_ORIGIN

  if (envRp && envOrigin) {
    return {
      rpName: RP_NAME,
      rpID: envRp,
      origin: envOrigin,
    }
  }

  const host = getRequestHost(event, { xForwardedHost: true })
  const protocol = getRequestProtocol(event)
  return {
    rpName: RP_NAME,
    rpID: host.split(':')[0],
    origin: `${protocol}://${host}`,
  }
}
