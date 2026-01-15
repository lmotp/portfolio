<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition, isLoading, path } = storeToRefs(pageTransitionStore);

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, scrollY, lenisRef } = storeToRefs(scrollTriggerStore);

const pathCookie = useCookie("path", {
  default: () => "/",
  maxAge: 60 * 60 * 24 * 7,
});
const route = useRoute();
const lenis = new Lenis();

const isPopState = ref(false);

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

const handlePopState = () => {
  isPopState.value = true;
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

    if (isPopState.value) path.value = url;
    else isPopState.value = false;

    pathCookie.value = url;
    setTimeout(() => {
      lenis!.resize();
      ScrollTrigger.refresh();
    }, 100);
  },
  { immediate: true }
);

onMounted(() => {
  init();

  window.addEventListener("popstate", handlePopState);
});
onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});
</script>

<template>
  <transition name="fade">
    <Loading v-if="isLoading" />
  </transition>

  <NuxtLayout>
    <PageTransition v-show="isPageTransition" />
    <Cursor />

    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
