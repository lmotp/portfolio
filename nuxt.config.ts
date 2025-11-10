// https://nuxt.com/docs/api/configuration/nuxt-config
import { glslify } from "vite-plugin-glslify";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  css: ["@/assets/css/main.css"],
  ssr: false,

  modules: ["@pinia/nuxt", "@nuxt/image", "@vueuse/nuxt"],

  build: {
    transpile: ["three"],
  },

  vite: {
    plugins: [glslify()],
  },

  app: {
    baseURL: "/portfolio/",
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
