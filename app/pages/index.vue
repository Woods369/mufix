<template>
  <div class="page-wrap">
    <FloatingIcons />

    <!-- Hero -->
    <section class="hero">
      <div class="container hero-content">
        <h1 class="hero-title">
          MIDI keyboards &amp;<br />
          <span class="text-gold">Electrical Intruments</span><br />
          repaired by hand.
        </h1>
        <p class="hero-sub">
          <strong> FREE </strong>Pick-up & Diagnostic checks covering <br> <strong>Lichfield</strong>, <strong>Tamworth</strong>,
          <strong>Sutton Coldfield</strong> <br> and surrounding <strong>Staffordshire</strong> areas.<br />
          Free Diagnostic Checks
        </p>
        <div class="hero-actions">
          <a href="#quote" class="btn btn-primary">Book a pickup</a>
          <a href="#services" class="btn btn-outline">View services</a>
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

    <!-- Full-width banner -->
    <section class="banner-section" style="background-image: url('/musical-instrument-circuitboard.jpg')">
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
            <h4>Repaired &amp; returned</h4>
            <p>Fixed, tested, and dropped back off. You don't even have to leave the house.</p>
          </div>
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
        <a href="mailto:fix@mufix.co.uk" class="btn btn-primary contact-btn">fix@mufix.co.uk</a>
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
    { name: 'description', content: 'Professional MIDI keyboard and electric guitar repairs in Lichfield, Tamworth, Sutton Coldfield, and Stafford. Free collection, fixed price quotes, fast turnaround.' },
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
        url: 'https://mufix.co.uk',
        email: 'fix@mufix.co.uk',
        description: 'MIDI keyboard and electric guitar repair services covering Lichfield, Tamworth, Sutton Coldfield, and Stafford.',
        areaServed: ['Lichfield', 'Tamworth', 'Sutton Coldfield', 'Stafford'],
        priceRange: '££',
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

/* Banner */
.banner-section {
  position: relative;
  z-index: 1;
  width: 250px;
  height: 250px;
  background-repeat: repeat;
  background-size: 2100px auto;
  background-position: -100px 0;
  opacity: 0.6;
  margin: 150px auto 0;
  border-radius: 50%;
}

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

.contact-btn {
  display: table;
  margin: 0 auto;
}
</style>
