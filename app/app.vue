<template>
  <div class="app">
    <a href="#main" class="skip-link">Skip to content</a>
    <header class="header">
      <div class="header-container header-inner">
        <NuxtLink to="/" class="logo">mufix</NuxtLink>
        <button
          class="nav-toggle"
          type="button"
          :aria-expanded="navOpen"
          aria-controls="site-nav"
          @click="navOpen = !navOpen"
        >
          <span class="sr-only">Menu</span>
          <span class="nav-toggle-bar" />
          <span class="nav-toggle-bar" />
          <span class="nav-toggle-bar" />
        </button>
        <nav id="site-nav" class="nav" :class="{ open: navOpen }" @click="navOpen = false">
          <NuxtLink to="/diagnostic">Diagnostic</NuxtLink>
          <NuxtLink v-if="authenticated" to="/orders">Orders</NuxtLink>
          <button v-if="authenticated" class="nav-logout" type="button" @click.stop="handleLogout">Logout</button>
          <NuxtLink v-if="!authenticated" to="/auth">Login</NuxtLink>
          <a :href="isHome ? '#services' : '/#services'">Services</a>
          <a :href="isHome ? '#contact' : '/#contact'">Contact</a>
          <a href="tel:+447814200476" class="nav-phone">Call</a>
          <a href="https://wa.me/447814200476" class="nav-wa" target="_blank" rel="noopener">WhatsApp</a>
        </nav>
      </div>
    </header>

    <main id="main">
      <NuxtPage />
    </main>

    <div v-if="showStickyCta" class="sticky-cta">
      <a href="/#quote" class="btn btn-primary sticky-cta-btn">Book pickup</a>
      <a href="https://wa.me/447814200476" class="btn btn-whatsapp sticky-cta-btn" target="_blank" rel="noopener">WhatsApp</a>
    </div>

    <footer class="footer">
      <div class="footer-container">
        <p>&copy; {{ year }} Mufix. All rights reserved.</p>
        <p class="footer-links">
          <NuxtLink to="/privacy">Privacy</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/terms">Terms</NuxtLink>
          <span aria-hidden="true">·</span>
          <a href="mailto:fix@mufix.co.uk">fix@mufix.co.uk</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const isHome = computed(() => route.path === '/')
const authenticated = ref(false)
const navOpen = ref(false)
const year = new Date().getFullYear()
const showStickyCta = computed(() => {
  const path = route.path
  return path === '/' || path === '/diagnostic'
})

watch(() => route.fullPath, () => { navOpen.value = false })

onMounted(async () => {
  try {
    const res = await $fetch<{ authenticated: boolean }>('/api/auth/me')
    authenticated.value = res.authenticated
  } catch {
    authenticated.value = false
  }
})

async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
  } catch { /* ignore */ }
  authenticated.value = false
  navOpen.value = false
  await router.push('/')
}
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #0a090c;
  --surface: #131016;
  --border: #221f2c;
  --text: #eeeaf2;
  --text-muted: #9088a3;
  --purple: #a78bfa;
  --purple-deep: #7c3aed;
  --purple-glow: rgba(167, 139, 250, 0.12);
  --gold: #fbbf24;
  --gold-dim: rgba(251, 191, 36, 0.15);
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 4rem;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -100px;
  z-index: 200;
  background: var(--purple);
  color: #0a090c;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
}

.skip-link:focus {
  top: 1rem;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-container {
  max-width: 1760px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (min-width: 768px) {
  .header-container { padding: 0 2.5rem; }
}

.footer-container {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 9, 12, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  gap: 1rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--purple), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
}

.nav-toggle-bar {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text);
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover,
.nav a:focus-visible,
.nav a.router-link-active {
  color: var(--text);
}

.nav a:focus-visible,
.nav-logout:focus-visible,
.btn:focus-visible,
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--purple);
  outline-offset: 2px;
}

.nav-phone {
  color: var(--gold) !important;
}

.nav-logout {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  transition: color 0.2s;
}

.nav-logout:hover {
  color: #ef4444;
}

@media (max-width: 720px) {
  .nav-toggle { display: flex; }
  .nav {
    display: none;
    position: absolute;
    top: 3.5rem;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: rgba(10, 9, 12, 0.97);
    border-bottom: 1px solid var(--border);
    padding: 0.5rem 0;
  }
  .nav.open { display: flex; }
  .nav a,
  .nav .nav-logout {
    padding: 0.875rem 1.25rem;
    text-align: left;
    width: 100%;
    border-bottom: 1px solid var(--border);
  }
}

.section {
  padding: 5rem 0;
  position: relative;
  z-index: 1;
}

.section-alt {
  background: var(--surface);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 3rem;
  text-align: center;
}

.footer {
  border-top: 1px solid var(--border);
  padding: 2rem 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.footer-links {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--text-muted);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--text);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--purple), var(--gold));
  color: #0a090c;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-outline {
  border: 1px solid var(--border);
  color: var(--text);
  background: transparent;
}

.btn-outline:hover:not(:disabled) {
  border-color: var(--text-muted);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.btn-danger {
  border-color: rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}
.btn-whatsapp {
  background: #128C7E;
  color: #fff !important;
  border: none;
}
.nav-wa { color: #34d399 !important; }
.sticky-cta {
  display: none;
}
@media (max-width: 720px) {
  .sticky-cta {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 90;
    gap: 0.5rem;
    padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
    background: rgba(10, 9, 12, 0.92);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
  }
  .sticky-cta-btn {
    flex: 1;
    padding: 0.85rem 0.75rem;
  }
  .app { padding-bottom: 5rem; }
}

</style>
