// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Mufix – MIDI Keyboard & Guitar Repairs | Lichfield, Tamworth, Stafford',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'Professional MIDI keyboard and electric guitar repairs covering Lichfield, Tamworth, Sutton Coldfield, and Stafford. Collection and drop-off. Fixed price quotes.' },
        { name: 'keywords', content: 'MIDI keyboard repair, guitar repair, Lichfield, Tamworth, Sutton Coldfield, Stafford, instrument repair, pickup collection' },
        { property: 'og:title', content: 'Mufix – Instrument Repairs in Staffordshire & the Midlands' },
        { property: 'og:description', content: 'MIDI keyboard and electric guitar repairs by hand. Free quote, collection available. Based in the Midlands.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://mufix.co.uk' },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [
        { rel: 'canonical', href: 'https://mufix.co.uk' },
      ]
    }
  }
})
