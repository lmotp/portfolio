<script setup lang="ts">
import gsap from "gsap";
import Intro from "./intro/index.vue";
import Outro from "./outro/index.vue";
import Experiments from "./experiments/index.vue";
import Footer from "./footer/index.vue";

import { usePageTransitionStore } from "@/stores/pageTransition";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

const pageTransitionStore = usePageTransitionStore();
const scrollTriggerStore = useScrollTriggerStore();
const { path } = storeToRefs(pageTransitionStore);
const { scrollTrigger, lenisRef } = storeToRefs(scrollTriggerStore);

onMounted(() => {
  gsap.delayedCall(0.2, () => {
    switch (path.value) {
      case "/":
        lenisRef.value!.scrollTo(0, {
          immediate: true,
        });
        break;

      case "/archives":
        lenisRef.value!.scrollTo(".outro .top-view-container", {
          offset: window.innerHeight,
          immediate: true,
        });
        break;

      case "/experiments":
        lenisRef.value!.scrollTo(".experiments .intro-wrapper", {
          immediate: true,
        });
        break;
    }
  });
});

onUnmounted(() => {
  scrollTrigger.value?.getAll().forEach((v) => {
    v.kill();
  });
});
</script>

<template>
  <Intro />
  <Outro />
  <Experiments />
  <Footer />
</template>

<style scoped></style>
