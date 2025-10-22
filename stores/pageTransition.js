import { defineStore } from "pinia";

export const usePageTransitionStore = defineStore("pageTransition", {
  state: () => ({
    isLoading: true,
    isPageTransition: false,
    path: "/",
  }),
  actions: {},
});
