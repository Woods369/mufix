export const WEBAUTHN_CONFIG = {
  rpName: 'Mufix',
  rpID: process.env.NODE_ENV === 'production' ? 'mufix.co.uk' : 'localhost',
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://mufix.co.uk'
      : 'http://localhost:3000',
}
