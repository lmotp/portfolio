import { defineStore } from "pinia";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useScrollTriggerStore = defineStore("scrollTrigger", {
  state: () => ({
    scrollTrigger: null as typeof ScrollTrigger | null,
    isIntroEnd: false,
    isOutroEnd: false,
  }),
  actions: {},
});
