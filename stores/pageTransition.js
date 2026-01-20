import { defineStore } from "pinia";

export const usePageTransitionStore = defineStore("pageTransition", {
  state: () => ({
    isLoading: true,
    downloadPercent: 0,
    isPageTransition: false,
    isDisabled: false,
    path: useCookie("path", { default: () => "/", maxAge: 60 * 60 * 24 * 7 }).value,
  }),
  actions: {},
});
