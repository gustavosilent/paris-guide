// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,  // Client-side only for GitHub Pages static hosting
  experimental: {
    appManifest: false
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    viewer: false,
    quiet: true
  },
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/paris-guide/' : '/',
    buildAssetsDir: '/assets/'
  }
})
