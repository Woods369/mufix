export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path.startsWith('/orders')) {
    try {
      const res = await $fetch<{ authenticated: boolean }>('/api/auth/me')
      if (!res.authenticated) {
        return navigateTo('/auth')
      }
    } catch {
      return navigateTo('/auth')
    }
  }
})
