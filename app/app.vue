<template>
  <div class="app">
    <header class="header">
      <div class="header-container header-inner">
        <a href="/" class="logo">mufix</a>
        <nav class="nav">
          <a href="/diagnostic">Diagnostic</a>
          <NuxtLink v-if="authenticated" to="/orders">Orders</NuxtLink>
          <button v-if="authenticated" class="nav-logout" @click="handleLogout">Logout</button>
          <NuxtLink v-if="!authenticated" to="/auth">Login</NuxtLink>
          <a :href="isHome ? '#services' : '/#services'">Services</a>
          <a :href="isHome ? '#contact' : '/#contact'">Contact</a>
        </nav>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="footer">
      <div class="footer-container">
        <p>&copy; {{ new Date().getFullYear() }} Mufix. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const isHome = computed(() => route.path === '/')
const authenticated = ref(false)

onMounted(async () => {
  try {
    const res = await $fetch('/api/auth/me')
    authenticated.value = (res as any).authenticated
  } catch {
    authenticated.value = false
  }
})

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  authenticated.value = false
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

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-container {
  max-width: 1760px;
  margin: 0 auto;
  padding: 0 2.5rem;
}

.footer-container {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 2.5rem;
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
  will-change: background;

  transition: all 400ms ease-in-out;
}

.logo:hover {
  background: linear-gradient(-120deg, var(--purple), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover {
  color: var(--text);
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

.btn-primary {
  background: linear-gradient(135deg, var(--purple), var(--gold));
  color: #0a090c;
}

.btn-primary:hover {
  opacity: 0.85;
}

.btn-outline {
  border: 1px solid var(--border);
  color: var(--text);
  background: transparent;
}

.btn-outline:hover {
  border-color: var(--text-muted);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}
</style>
