<template>
  <div class="legal-page section">
    <div class="container legal">
      <h1>Privacy policy</h1>
      <p class="muted">Last updated: 26 August 2026</p>
      <p>Mufix (“we”, “us”) provides instrument repair services and this website. This notice explains what we collect and why.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Contact details you send by email, phone, or Calendly when booking a collection or quote.</li>
        <li>Repair details and photos you provide (or that we take of your instrument for diagnosis).</li>
        <li>Technical data such as IP address and basic server logs when you use the site.</li>
        <li>Admin account data: WebAuthn credential material for the shop login (not customer accounts).</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To schedule collection, diagnose and repair instruments, and communicate about jobs.</li>
        <li>To operate and secure the website and repair dashboard.</li>
      </ul>
      <h2>Sharing</h2>
      <p>We use processors such as hosting (e.g. Vercel), booking (Calendly), and storage providers as needed to run the service. We do not sell your data.</p>
      <h2>Retention</h2>
      <p>Repair records and photos are kept as long as needed for the job, warranty (90 days on completed repairs), and legitimate business records, then deleted or anonymised where practical.</p>
      <h2>Your rights</h2>
      <p>Under UK GDPR you may request access, correction, deletion, or restriction of your personal data where applicable. Contact <a href="mailto:fix@mufix.co.uk">fix@mufix.co.uk</a>.</p>
      <h2>Contact</h2>
      <p>Mufix, Lichfield, Staffordshire, UK · <a href="mailto:fix@mufix.co.uk">fix@mufix.co.uk</a> · <a href="tel:+447814200476">07814 200476</a></p>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Privacy policy – Mufix' })
</script>

<style scoped>
.legal-page { padding-top: 5rem; }
.legal { max-width: 720px; }
.legal h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.legal h2 { font-size: 1.125rem; margin: 2rem 0 0.75rem; }
.legal p, .legal li { color: var(--text-muted); margin-bottom: 0.75rem; }
.legal ul { padding-left: 1.25rem; }
.legal a { color: var(--purple); }
.muted { font-size: 0.875rem; opacity: 0.8; }
</style>
