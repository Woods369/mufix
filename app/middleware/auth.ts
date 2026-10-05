export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/orders')) return

  try {
    const res = await $fetch<{ authenticated: boolean }>('/api/auth/me')
    if (!res.authenticated) {
      return navigateTo('/auth')
    }
  } catch {
    return navigateTo('/auth')
  }
})
