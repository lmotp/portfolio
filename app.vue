<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition } = storeToRefs(pageTransitionStore);

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger } = storeToRefs(scrollTriggerStore);

onMounted(() => {
  scrollTrigger.value = ScrollTrigger;
});
</script>

<template>
  <NuxtLayout>
    <PageTransition v-show="isPageTransition" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
