// https://nuxt.com/docs/api/configuration/nuxt-config
import glsl from "vite-plugin-glsl";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["@/assets/css/main.css"],

  modules: ["@pinia/nuxt"],

  build: {
    transpile: ["three"],
  },

  vite: {
    plugins: [glsl()],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "ko",
      },
      link: [
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css",
        },
      ],
    },
  },

  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
});
