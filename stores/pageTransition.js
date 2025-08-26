import { defineStore } from "pinia";

export const usePageTransitionStore = defineStore("pageTransition", {
  state: () => ({
    isPageTransition: true,
  }),
  actions: {},
});
