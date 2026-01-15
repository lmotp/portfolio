// https://nuxt.com/docs/api/configuration/nuxt-config
import { glslify } from "vite-plugin-glslify";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  css: ["@/assets/css/main.css"],
  ssr: false,
  spaLoadingTemplate: true,

  routeRules: {
    "/images/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
    "/videos/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
  },

  modules: ["@pinia/nuxt", "@nuxt/image", "@vueuse/nuxt", "@nuxt/icon", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Orbitron: [400, 700, 900],
      "Dela Gothic One": true,
      Inter: [300, 400, 700],
    },
    display: "swap", // 성능 최적화
    prefetch: true,
    preconnect: true,
    preload: true,
  },

  build: {
    transpile: ["three"],
  },

  vite: {
    plugins: [glslify()],
  },

  app: {
    baseURL: "/portfolio/",

    head: {
      title: "CHEOLSOON | UI Publisher Portfolio",
      htmlAttrs: {
        lang: "ko",
      },
      meta: [{ name: "description", content: "Nuxt 3로 만든 멋진 웹사이트입니다." }],
      link: [
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css",
        },
        { rel: "icon", type: "image/x-icon", href: "/portfolio/favicon.ico" },
      ],
    },
  },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
});
