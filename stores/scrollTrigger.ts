import { defineStore } from "pinia";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export const useScrollTriggerStore = defineStore("scrollTrigger", {
  state: () => ({
    lenisRef: null as Lenis | null,
    scrollTrigger: null as typeof ScrollTrigger | null,
    isIntroEnd: false,
    scrollY: 0,
  }),
  actions: {},
});
