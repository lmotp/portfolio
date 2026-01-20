<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";
import Side from "./Side.vue";

const pageTransitionStore = usePageTransitionStore();
const { downloadPercent } = storeToRefs(pageTransitionStore);
</script>

<template>
  <main :class="[downloadPercent > 0 && 'loading']">
    <Side />
    <slot />
  </main>
</template>
<style scoped>
main {
  width: 100%;
  isolation: isolate;
  overflow: clip;
  background-color: var(--gray);

  &.loading {
    pointer-events: none;
    user-select: none;
  }
}
</style>
