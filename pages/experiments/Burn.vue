<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

import Burn from "~/components/experiments/Burn.vue";

const pageTransitionStore = usePageTransitionStore();
const { downloadPercent } = storeToRefs(pageTransitionStore);

const timer = ref<ReturnType<typeof setInterval> | null>(null);

const init = () => {
  timer.value = setInterval(() => {
    const increment = Math.floor(Math.random() * 5) + 1;

    if (downloadPercent.value + increment >= 100) {
      downloadPercent.value = 100;
      if (timer.value) clearInterval(timer.value);
    } else {
      downloadPercent.value += increment;
    }
  }, 25);
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<template>
  <Burn />
</template>

<style scoped></style>
