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

const pathCookie = useCookie("path", {
  default: () => "/",
  maxAge: 60 * 60 * 24 * 7,
});
const route = useRoute();
const lenis = new Lenis();

const init = () => {
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
  toRef(() => route.path),
  (url) => {
    let title;

    if (url.includes("/archives")) title = `Archives | ${url.split("/").at(-1)?.toUpperCase()}`;
    else if (url.includes("/experiments")) title = `Experiments | ${url.split("/").at(-1)?.toUpperCase()}`;
    else title = "CHEOLSOON | UI Publisher Portfolio";

    useHead({
      title: title,
    });

    pathCookie.value = url;
    lenis!.resize();
    ScrollTrigger.refresh();
  },
  { immediate: true }
);

onMounted(() => {
  init();
});
</script>

<template>
  <NuxtLayout>
    <PageTransition v-show="isPageTransition" />
    <Cursor />

    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
