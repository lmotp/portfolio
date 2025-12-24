<script setup lang="ts">
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
const { lenisRef } = storeToRefs(scrollTriggerStore);

onMounted(() => {
  switch (path.value) {
    case "/":
      lenisRef.value!.scrollTo(0, {
        duration: 3.5,
      });
      break;

    case "/works":
      lenisRef.value!.scrollTo(".outro .top-view-container", {
        offset: window.innerHeight,
        duration: 3.5,
      });
      break;

    case "/experiments":
      lenisRef.value!.scrollTo(".skills-intro", {
        duration: 3.5,
      });
      break;
  }
});
</script>

<template>
  <Intro />
  <Outro />
  <Experiments />
  <Footer />
</template>

<style scoped></style>
