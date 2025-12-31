import { defineStore } from "pinia";

export const usePageTransitionStore = defineStore("pageTransition", {
  state: () => ({
    isLoading: true,
    isPageTransition: false,
    path: useCookie("path", { default: () => "/", maxAge: 60 * 60 * 24 * 7 }).value,
  }),
  actions: {},
});
