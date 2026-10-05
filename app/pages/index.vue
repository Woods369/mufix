<template>
  <div class="page-wrap">
    <FloatingIcons />

    <!-- Hero -->
    <section class="hero">
      <div class="container hero-content">
        <h1 class="hero-title">
          MIDI keyboards &amp;<br />
          <span class="text-gold">Electric instruments</span><br />
          repairs.
        </h1>
        <p class="hero-sub">
          <strong> FREE </strong>Pick-up & Diagnostic checks covering <br> <strong>Lichfield</strong>, <strong>Tamworth</strong>,
          <strong>Sutton Coldfield</strong>, <strong>Stafford</strong> <br> and the wider <strong>Midlands</strong>.<br />
          <span>FREE Diagnostic Checks</span>
        </p>
        <div class="trust-row">
          <span class="trust-chip">Free collection</span>
          <span class="trust-chip">Fixed quotes</span>
          <span class="trust-chip">90-day warranty</span>
          <span class="trust-chip">Musician-tested</span>
        </div>
        <div class="hero-actions">
          <a href="#quote" class="btn btn-primary">Book a pickup</a>
          <NuxtLink to="/diagnostic" class="btn btn-outline">Try key tester</NuxtLink>
          <a href="https://wa.me/447814200476" class="btn btn-whatsapp" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </section>

    <!-- Proof strip -->
    <section class="proof-strip">
      <div class="container proof-grid">
        <div class="proof-card">
          <span class="proof-kicker">Bench story</span>
          <h3>Dead velocity lane</h3>
          <p>Akai MPK — C3–E3 silent. Cleaned contacts, reseated ribbon, keys back at full velocity.</p>
        </div>
        <div class="proof-card">
          <span class="proof-kicker">Electronics</span>
          <h3>Crackly output jack</h3>
          <p>Strat-style rewire + shielding. Noise floor dropped; stage-ready again same week.</p>
        </div>
        <div class="proof-card">
          <span class="proof-kicker">PCB work</span>
          <h3>Blown power path</h3>
          <p>Trace repair + cap swap on a stage piano PSU rail. Fired up, stayed up.</p>
        </div>
      </div>
    </section>
    <!-- Radar Pickup CTA -->
    <section id="pickup" class="section radar-section">
      <div class="radar-bg">
        <div class="radar-ring"></div>
        <div class="radar-ring"></div>
        <div class="radar-ring"></div>
        <div class="radar-ring"></div>
      </div>
      <div class="container radar-content">
        <div class="radar-icon-wrap">
          <MapPin :size="32" class="radar-pin" />
        </div>
        <h2 class="section-title">Book a pickup</h2>
        <p class="radar-text">
          We'll collect your gear from <strong>Lichfield</strong>, <strong>Tamworth</strong>,
          <strong>Sutton Coldfield</strong>, <strong>Stafford</strong> and the surrounding areas.
          Tell us when you're free and we'll come to you.
        </p>
        <a href="#quote" class="btn btn-primary btn-pulse">
          Request a quote &amp; pickup
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </section>

    <!-- Quote Form -->
    <section id="quote" class="section section-alt">
      <div class="container calendly-container">
        <h2 class="section-title">Book a free collection</h2>
        <p class="calendly-intro">
          Pick a date and time that works for you. We'll collect your gear and get it sorted.
        </p>
        <div class="calendly-inline-widget" data-url="https://calendly.com/mufix/30min?hide_landing_page_details=1&hide_gdpr_banner=1" style="min-width:320px;height:600px;"></div>
      </div>
    </section>

    <!-- Showcase -->
    <section class="showcase">
      <div class="showcase-bg" style="background-image: url('/AKAI_MPK_CIRCUITBOARD.jpg')" />
      <div class="container showcase-inner">
        <div class="price-card">
          <p class="price-label">Most repairs</p>
          <p class="price-range">£35–£80</p>
          <p class="price-note">Simple jobs from ~£25. You approve a fixed quote before work starts.</p>
          <a href="#quote" class="btn btn-primary">Get a free diagnostic</a>
        </div>
        <div class="showcase-copy">
          <h2>Circuit-board level. Not just part swaps.</h2>
          <p>We diagnose MIDI controllers and electrics the way musicians actually break them — dead keys, flaky USB, noisy jacks, tired power rails.</p>
          <NuxtLink to="/diagnostic" class="showcase-link">Open the free key tester →</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="section">
      <div class="container">
        <h2 class="section-title">Services</h2>
        <div class="cards">
          <div class="card">
            <div class="card-icon card-icon--purple">
              <KeyboardMusic :size="24" />
            </div>
            <h3 class="card-title">MIDI Keyboards</h3>
            <p class="card-text">
              Specialist repairs for MIDI controllers, synthesisers, stage pianos, and electronic
              keyboards. Circuit-board level diagnosis, not just swapping parts.
            </p>
            <ul class="card-list card-list--purple">
              <li>Key mechanism &amp; velocity sensor repair</li>
              <li>MIDI port, USB &amp; power jack replacement</li>
              <li>Capacitor &amp; power supply fault diagnosis</li>
              <li>Patch &amp; restore broken PCB traces</li>
            </ul>
          </div>

          <div class="card">
            <div class="card-icon card-icon--gold">
              <Guitar :size="24" />
            </div>
            <h3 class="card-title">Electric Guitars</h3>
            <p class="card-text">
              Full setup, electronics repair, and structural work for electric guitars and basses.
              Whether it's a noisy signal or a snapped neck, we can bring it back to life.
            </p>
            <ul class="card-list card-list--gold">
              <li>Full setup &mdash; action, intonation, truss rod</li>
              <li>Pickup swaps, re-wiring &amp; shielding</li>
              <li>Fret level, crown &amp; dress</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">How it works</h2>
        <div class="steps">
          <div class="step">
            <span class="step-num">01</span>
            <h4>Book a quote</h4>
            <p>Fill in the form or drop us a message. Tell us your gear, the issue, and when you're free for collection.</p>
          </div>
          <div class="step-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </div>
          <div class="step">
            <span class="step-num">02</span>
            <h4>We collect &amp; fix</h4>
            <p>Free collection from Lichfield, Tamworth, Sutton Coldfield or Stafford. We'll diagnose it and give you a fixed price.</p>
          </div>
          <div class="step-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </div>
          <div class="step">
            <span class="step-num">03</span>
            <h4>Repaired, tested &amp; returned</h4>
            <p>Fixed, tested by real musicians, and dropped back off. You don't even have to leave the house.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="section">
      <div class="container faq-container">
        <h2 class="section-title">Frequently asked questions</h2>
        <div class="faq-list">
          <details class="faq-item">
            <summary class="faq-question">How long does a typical repair take?</summary>
            <div class="faq-answer">
              <p>Most repairs are completed within <strong>3&ndash;7 working days</strong> from collection. Simple setup work on guitars can be turned around in 24&ndash;48 hours. We'll give you a realistic timeframe after the free diagnostic.</p>
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">How much does a repair cost?</summary>
            <div class="faq-answer">
              <p>We give a <strong>fixed price quote</strong> after the free diagnostic check &mdash; no surprise add-ons. Simple jobs start from around <strong>&pound;25</strong>, with most repairs falling in the <strong>&pound;35&ndash;&pound;80</strong> range. You approve the price before any work begins.</p>
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">Do you offer a warranty on repairs?</summary>
            <div class="faq-answer">
              <p>All repairs come with a <strong>90-day warranty</strong> on parts and labour. If the same fault reappears, we'll fix it free of charge.</p>
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">Do I need to bring my gear to you?</summary>
            <div class="faq-answer">
              <p>Nope. We offer <strong>free collection and drop-off</strong> across Lichfield, Tamworth, Sutton Coldfield and Stafford. You can also drop off at our Lichfield base if you prefer.</p>
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">Can you work on any brand of MIDI keyboard or guitar?</summary>
            <div class="faq-answer">
              <p>We work on most makes and models. For MIDI keyboards: Roland, Korg, Yamaha, Novation, Akai, Arturia, Native Instruments and more. For guitars: Fender, Gibson, Ibanez, PRS, Squier, Epiphone and any custom builds. If you're unsure, drop us a message and we'll let you know.</p>
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">How do I know if my gear can be fixed?</summary>
            <div class="faq-answer">
              <p>Most issues are fixable. Dead keys, crackling outputs, broken jacks, power failures, loose fretwire &mdash; we've seen it all. The free diagnostic will tell you exactly what's wrong and whether it's economical to repair. We'll be straight with you if it's not worth fixing.</p>
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">What's included in a MIDI keyboard diagnostic?</summary>
            <div class="faq-answer">
              <p>We check every key for velocity response, test all outputs (MIDI, USB, audio), inspect the power supply and capacitors, and look for broken traces on the circuit board. You get a detailed explanation of the fault and a fixed price to fix it.</p>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section section-alt">
      <div class="container">
        <h2 class="section-title">Get in touch</h2>
        <p class="contact-text">
          Based in <strong>Lichfield</strong> &mdash; collecting from <strong>Tamworth</strong>,
          <strong>Sutton Coldfield</strong>, <strong>Stafford</strong> and surrounding areas.
          Drop us a message and we'll get back to you within 24 hours.
        </p>
        <div class="contact-actions">
          <a href="mailto:fix@mufix.co.uk" class="btn btn-primary">fix@mufix.co.uk</a>
          <a href="tel:+447814200476" class="btn btn-outline">07814 200476</a>
          <a href="https://wa.me/447814200476" class="btn btn-whatsapp" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import FloatingIcons from '~/components/FloatingIcons.vue'
import { KeyboardMusic, Guitar, MapPin } from 'lucide-vue-next'

useHead({
  title: 'Mufix – MIDI Keyboard & Guitar Repairs | Lichfield, Tamworth, Stafford',
  meta: [
    { name: 'description', content: 'Professional MIDI keyboard and electric guitar repairs in Lichfield, Tamworth, Sutton Coldfield, Stafford and the Midlands. Free collection, fixed price quotes, fast turnaround. Repairs tested by real musicians.' },
    { name: 'google-site-verification', content: 'aBYh5lF-YWR6ZeZ76fsrAdqnuYkmwu3pZWi9pLxhhbo' },
  ],
  link: [
    { rel: 'stylesheet', href: 'https://assets.calendly.com/assets/external/widget.css' },
  ],
  script: [
    {
      src: 'https://assets.calendly.com/assets/external/widget.js',
      async: true,
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Mufix',
        url: 'https://www.mufix.co.uk',
        email: 'fix@mufix.co.uk',
        telephone: '07814 200476',
        image: 'https://www.mufix.co.uk/musical-instrument-circuitboard.png',
        description: 'MIDI keyboard and electric guitar repair services covering Lichfield, Tamworth, Sutton Coldfield, Stafford, and the Midlands.',
        areaServed: ['Lichfield', 'Tamworth', 'Sutton Coldfield', 'Stafford', 'Midlands'],
        priceRange: '££',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '10:00',
            closes: '14:00',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lichfield',
          addressRegion: 'Staffordshire',
          addressCountry: 'GB',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Instrument repair services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'MIDI Keyboard Repair',
                description: 'Circuit-board level diagnosis and repair for MIDI controllers, synthesisers, stage pianos and electronic keyboards.',
                areaServed: ['Lichfield', 'Tamworth', 'Sutton Coldfield', 'Stafford', 'Midlands'],
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Electric Guitar Repair',
                description: 'Full setup, electronics repair, pickup swaps, fret work and structural repairs for electric guitars and basses.',
                areaServed: ['Lichfield', 'Tamworth', 'Sutton Coldfield', 'Stafford', 'Midlands'],
              },
            },
          ],
        },
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How long does a typical repair take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most repairs are completed within 3–7 working days from collection. Simple setup work on guitars can be turned around in 24–48 hours. We give you a realistic timeframe after the free diagnostic.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does a repair cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We give a fixed price quote after the free diagnostic check — no surprise add-ons. Simple jobs start from around £25, with most repairs falling in the £35–£80 range. You approve the price before any work begins.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer a warranty on repairs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All repairs come with a 90-day warranty on parts and labour. If the same fault reappears, we fix it free of charge.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need to bring my gear to you?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No — we offer free collection and drop-off across Lichfield, Tamworth, Sutton Coldfield and Stafford. You can also drop off at our Lichfield base if you prefer.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can you work on any brand of MIDI keyboard or guitar?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We work on most makes and models: Roland, Korg, Yamaha, Novation, Akai, Arturia, Native Instruments for MIDI keyboards, and Fender, Gibson, Ibanez, PRS, Squier, Epiphone for guitars. Drop us a message if you are unsure.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I know if my gear can be fixed?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most issues are fixable — dead keys, crackling outputs, broken jacks, power failures, loose fretwire. The free diagnostic tells you exactly what is wrong and whether it is economical to repair.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is included in a MIDI keyboard diagnostic?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We check every key for velocity response, test all outputs (MIDI, USB, audio), inspect the power supply and capacitors, and look for broken traces on the circuit board. You get a detailed explanation of the fault and a fixed price to fix it.',
            },
          },
        ],
      }),
    },
  ],
})

// Calendly handles the booking — no custom form needed
</script>

<style scoped>
.page-wrap {
  position: relative;
}

/* Hero */
.hero {
  min-height: 96svh;
  display: flex;
  align-items: center;
  padding: 6rem 0 4rem;
  position: relative;
  z-index: 1;
  background:
    radial-gradient(ellipse 80% 50% at 50% 20%, var(--purple-glow), transparent);
}

.hero-content {
  text-align: center;
  max-width: 640px;
}

.hero-title {
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
}

.text-gold {
  color: var(--gold);
}

.hero-sub {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 400px;
  margin: 0 auto 2rem;
}

.hero-sub > span {
  color: var(--gold);
  padding-top: 50px;
  font-weight: 700;
  display: block;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Radar Pickup Section */
.radar-section {
  overflow: hidden;
  background: var(--bg);
  position: relative;
}

.radar-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.radar-ring {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 1px solid var(--purple);
  opacity: 0;
  animation: radar-pulse 4s ease-out infinite;
}

.radar-ring:nth-child(2) { animation-delay: 1s; }
.radar-ring:nth-child(3) { animation-delay: 2s; }
.radar-ring:nth-child(4) { animation-delay: 3s; }

@media (min-width: 768px) {
  .radar-ring {
    width: 500px;
    height: 500px;
  }
}

@keyframes radar-pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.5;
    border-color: var(--purple);
  }
  50% {
    opacity: 0.2;
    border-color: var(--gold);
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    border-color: var(--gold);
  }
}

.radar-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.radar-icon-wrap {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.25);
  animation: pin-pulse 2s ease-in-out infinite;
}

.radar-pin {
  color: var(--purple);
}

@keyframes pin-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.3); }
  50% { box-shadow: 0 0 0 16px rgba(167, 139, 250, 0); }
}

.radar-text {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto 2rem;
}

.btn-pulse {
  animation: btn-glow 2s ease-in-out infinite;
}

@keyframes btn-glow {
  0%, 100% { box-shadow: 0 0 12px rgba(167, 139, 250, 0.2); }
  50% { box-shadow: 0 0 28px rgba(167, 139, 250, 0.4); }
}

/* Calendly booking section */
.calendly-container {
  max-width: 860px;
}

.calendly-intro {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

.calendly-inline-widget {
  border-radius: 8px;
  overflow: hidden;
}

.trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.75rem;
}
.trust-chip {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--purple);
  border: 1px solid rgba(167,139,250,0.28);
  background: rgba(167,139,250,0.08);
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
}
.btn-whatsapp {
  background: #128C7E;
  color: #fff;
  border: none;
}
.btn-whatsapp:hover { opacity: 0.9; color: #fff; }

.proof-strip {
  position: relative;
  z-index: 1;
  padding: 0 0 3rem;
}
.proof-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
@media (max-width: 800px) {
  .proof-grid { grid-template-columns: 1fr; }
}
.proof-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.25rem 1.35rem;
  transition: border-color 0.2s, transform 0.2s;
}
.proof-card:hover {
  border-color: rgba(167,139,250,0.45);
  transform: translateY(-2px);
}
.proof-kicker {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.5rem;
}
.proof-card h3 {
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
}
.proof-card p {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.showcase {
  position: relative;
  z-index: 1;
  margin: 2rem 0 1rem;
  min-height: 340px;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.showcase-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: saturate(1.1) brightness(0.35);
  transform: scale(1.02);
}
.showcase::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(10,9,12,0.92) 0%, rgba(10,9,12,0.55) 55%, rgba(10,9,12,0.3) 100%);
}
.showcase-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
}
@media (max-width: 800px) {
  .showcase-inner { grid-template-columns: 1fr; }
}
.price-card {
  background: rgba(19,16,22,0.92);
  border: 1px solid rgba(167,139,250,0.35);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 0 40px rgba(167,139,250,0.12);
}
.price-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}
.price-range {
  font-size: clamp(2.5rem, 5vw, 3.25rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--purple), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.75rem;
}
.price-note {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.showcase-copy h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}
.showcase-copy p {
  color: var(--text-muted);
  margin-bottom: 1rem;
  max-width: 36ch;
}
.showcase-link {
  color: var(--gold);
  font-weight: 600;
  text-decoration: none;
}
.showcase-link:hover { text-decoration: underline; }


/* Cards */
.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}

.card:first-child::before {
  background: linear-gradient(90deg, var(--purple), transparent);
}

.card:last-child::before {
  background: linear-gradient(90deg, var(--gold), transparent);
}

.card-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 1.25rem;
}

.card-icon--purple {
  background: rgba(167, 139, 250, 0.08);
  color: var(--purple);
}

.card-icon--gold {
  background: var(--gold-dim);
  color: var(--gold);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.card-text {
  color: var(--text-muted);
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
}

.card-list {
  list-style: none;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.card-list li {
  position: relative;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.card-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.card-list--purple li::before {
  background: var(--purple);
}

.card-list--gold li::before {
  background: var(--gold);
}

/* Steps */
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.step {
  text-align: center;
  max-width: 220px;
}

.step-num {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--purple), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.step h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.step p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.step-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .steps {
    flex-direction: column;
    text-align: center;
  }
  .step-arrow {
    transform: rotate(90deg);
  }
}

/* Contact */
.contact-text {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.contact-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* FAQ */
.faq-container {
  max-width: 720px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.faq-item[open] {
  border-color: var(--purple);
}

.faq-question {
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::after {
  content: '+';
  font-size: 1.25rem;
  color: var(--purple);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.faq-item[open] .faq-question::after {
  content: '−';
}

.faq-answer {
  padding: 0 1.25rem 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.faq-answer p {
  margin: 0;
}
</style>
