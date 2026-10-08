// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/icon/module"],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: { port: 3010 },
  vite: {
    plugins: [ tailwindcss() ]
  },
  css: ["~/assets/css/main.css"],
})
