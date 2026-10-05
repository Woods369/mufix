<template>
  <div class="legal-page section">
    <div class="container legal">
      <h1>Terms of service</h1>
      <p class="muted">Last updated: 26 August 2026</p>
      <p>These terms cover use of mufix.co.uk and repair work carried out by Mufix.</p>
      <h2>Quotes and work</h2>
      <p>Diagnostics described as free are subject to fair use. We provide a fixed price before paid repair work begins. You approve the quote before we proceed unless you have agreed otherwise in writing.</p>
      <h2>Collection and risk</h2>
      <p>We take reasonable care of instruments in our possession. You should declare high value, existing damage, and any fragile custom mods when booking. We are not insurers; consider your own cover for high-value gear.</p>
      <h2>Turnaround</h2>
      <p>Timescales given after diagnosis are estimates. Parts availability and complex faults can extend turnaround.</p>
      <h2>Warranty</h2>
      <p>Completed repairs include a 90-day warranty on the workmanship and parts we supplied for the fault we fixed. It does not cover new unrelated faults, misuse, or third-party modifications after return.</p>
      <h2>Website</h2>
      <p>The public site and diagnostic tool are provided as-is. The admin dashboard is for authorised operators only. Do not attempt to access it without permission.</p>
      <h2>Contact</h2>
      <p><a href="mailto:fix@mufix.co.uk">fix@mufix.co.uk</a> · <a href="tel:+447814200476">07814 200476</a></p>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Terms of service – Mufix' })
</script>

<style scoped>
.legal-page { padding-top: 5rem; }
.legal { max-width: 720px; }
.legal h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.legal h2 { font-size: 1.125rem; margin: 2rem 0 0.75rem; }
.legal p, .legal li { color: var(--text-muted); margin-bottom: 0.75rem; }
.legal a { color: var(--purple); }
.muted { font-size: 0.875rem; opacity: 0.8; }
</style>
