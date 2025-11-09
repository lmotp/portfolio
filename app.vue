<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition } = storeToRefs(pageTransitionStore);

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, scrollY, lenisRef } = storeToRefs(scrollTriggerStore);

const route = useRoute();

const init = () => {
  const lenis = new Lenis();

  lenis.on("scroll", () => {
    scrollY.value = window.scrollY;
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  scrollTrigger.value = ScrollTrigger;
  lenisRef.value = lenis;
};

watch(
  () => route.path,
  () => {
    window.scrollTo(0, 0);
  }
);

onMounted(() => {
  init();
});
</script>

<template>
  <NuxtLayout>
    <!-- <Loading /> -->
    <PageTransition v-show="isPageTransition" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
