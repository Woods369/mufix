<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-icon" :class="{ pulse: status === 'waiting' }">
        <Usb :size="40" />
      </div>

      <h1 class="auth-title">
        {{ screenTitle }}
      </h1>
      <p class="auth-sub">{{ screenSub }}</p>

      <!-- Error -->
      <p v-if="error" class="auth-error">{{ error }}</p>

      <!-- First-time setup -->
      <template v-if="!hasCredential && !status">
        <button class="btn btn-primary auth-btn" @click="register">
          <Usb :size="18" />
          Register device
        </button>
        <p class="auth-hint">
          Connect your security key via USB and tap it when prompted.
        </p>
      </template>

      <!-- Registered, not yet logged in -->
      <template v-else-if="hasCredential && !status">
        <button class="btn btn-primary auth-btn" @click="login">
          <Usb :size="18" />
          Login
        </button>
        <p class="auth-hint">
          Tap your security key when prompted.
        </p>
        <button class="auth-link-btn" @click="handleLogoutBeforeReRegister">Register a different key</button>
      </template>

      <!-- Waiting for key -->
      <div v-if="status === 'waiting'" class="waiting-indicator">
        <div class="waiting-spinner"></div>
        <p>Waiting for your security key…</p>
      </div>

      <!-- Success -->
      <div v-if="status === 'success'" class="success-indicator">
        <CheckCircle :size="24" />
        <p>{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
import { Usb, CheckCircle } from 'lucide-vue-next'

const router = useRouter()

const hasCredential = ref(false)
const status = ref<'waiting' | 'success' | ''>('')
const error = ref('')
const successMessage = ref('')

// Load initial state
onMounted(async () => {
  try {
    const res = await $fetch<{ authenticated: boolean; hasCredential: boolean }>('/api/auth/me')
    hasCredential.value = res.hasCredential
    if (res.authenticated) {
      await router.push('/orders')
    }
  } catch {
    // server not available
  }
})

const screenTitle = computed(() => {
  if (hasCredential.value) return 'Login required'
  return 'Register a security key'
})

const screenSub = computed(() => {
  if (hasCredential.value) return 'Tap your security key to access the repair dashboard.'
  return 'Register a security key. You only need to do this once.'
})

async function register() {
  error.value = ''
  status.value = 'waiting'
  try {
    const options = await $fetch<any>('/api/auth/register/begin', { method: 'POST' })
    const attResp = await startRegistration({ optionsJSON: options })
    await $fetch('/api/auth/register/complete', {
      method: 'POST',
      body: attResp,
    })

    hasCredential.value = true
    status.value = 'success'
    successMessage.value = 'Key registered!'

    // Auto-login
    setTimeout(async () => {
      await login()
    }, 800)
  } catch (e: any) {
    status.value = ''
    error.value = e?.message || 'Registration failed. Make sure your key is connected via USB.'
  }
}

async function login() {
  error.value = ''
  status.value = 'waiting'
  try {
    const options = await $fetch<any>('/api/auth/login/begin', { method: 'POST' })
    const authResp = await startAuthentication({ optionsJSON: options })
    await $fetch('/api/auth/login/complete', {
      method: 'POST',
      body: authResp,
    })

    status.value = 'success'
    successMessage.value = 'Logged in!'
    setTimeout(() => {
      router.push('/orders')
    }, 500)
  } catch (e: any) {
    status.value = ''
    error.value = e?.message || 'Login failed. Tap your key and try again.'
  }
}

async function handleLogoutBeforeReRegister() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await register()
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg);
}

.auth-card {
  max-width: 420px;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
}

.auth-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(167, 139, 250, 0.1);
  color: var(--purple);
  border: 1px solid rgba(167, 139, 250, 0.2);
}

.auth-icon.pulse {
  animation: icon-pulse 1.5s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.3); }
  50% { box-shadow: 0 0 0 16px rgba(167, 139, 250, 0); }
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.auth-sub {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 2rem;
}

.auth-error {
  font-size: 0.8125rem;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.auth-btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
}

.auth-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 1rem;
  opacity: 0.7;
}

.auth-link-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1.25rem;
  font-family: inherit;
}

.auth-link-btn:hover {
  color: var(--text);
}

/* Waiting */
.waiting-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.waiting-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--purple);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success */
.success-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #4ade80;
  font-size: 0.9375rem;
  font-weight: 600;
}
</style>
