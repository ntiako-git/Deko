// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/icon/module", "nuxt-auth-utils"],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: { port: 3010 },
  vite: {
    plugins: [ tailwindcss() ]
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    oauth: {
      discord: {
        clientId: '1558629466509418566',
        clientSecret: process.env.CLIENT_SECRET,
      }
    },
    session: {
      maxAge: 60 * 60 * 24 * 7
    }
  }
})
