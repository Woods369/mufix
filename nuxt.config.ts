// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Mufix – MIDI Keyboard & Guitar Repairs | Lichfield, Tamworth, Stafford',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en-GB' },
      meta: [
        { name: 'description', content: 'Professional MIDI keyboard and electric guitar repairs covering Lichfield, Tamworth, Sutton Coldfield, and Stafford. Collection and drop-off. Fixed price quotes.' },
        { name: 'keywords', content: 'MIDI keyboard repair, guitar repair, Lichfield, Tamworth, Sutton Coldfield, Stafford, instrument repair, pickup collection' },
        { property: 'og:title', content: 'Mufix – Instrument Repairs in Staffordshire & the Midlands' },
        { property: 'og:description', content: 'MIDI keyboard and electric guitar repairs by hand. Free quote, collection available. Based in the Midlands.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.mufix.co.uk' },
        { property: 'og:image', content: 'https://www.mufix.co.uk/musical-instrument-circuitboard.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Mufix – Instrument Repairs in Staffordshire & the Midlands' },
        { name: 'twitter:description', content: 'MIDI keyboard and electric guitar repairs. Free collection across the Midlands.' },
        { name: 'twitter:image', content: 'https://www.mufix.co.uk/musical-instrument-circuitboard.jpg' },
        { name: 'theme-color', content: '#0a090c' },
      ],
      link: [
        { rel: 'canonical', href: 'https://www.mufix.co.uk' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  vite: {
    optimizeDeps: {
      include: ['@simplewebauthn/browser'],
    },
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
          'X-DNS-Prefetch-Control': 'off',
        },
      },
      '/api/**': {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    },
  },
})
