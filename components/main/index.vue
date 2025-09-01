<script setup lang="ts">
import Intro from "./intro/index.vue";
import Outro from "./outro/index.vue";
import Footer from "./footer/index.vue";

const { viewRef } = defineProps<{ viewRef: HTMLElement | null }>();
</script>

<template>
  <Intro :view-ref="viewRef" />

  <div class="mask"></div>

  <Outro />

  <Footer />
</template>

<style scoped>
.mask {
  --mask-count: 8;
  --mask-index: 2;

  position: absolute;
  inset: 0;
  mask-image: url("/images/mask.webp");
  mask-position: center calc(100% / (var(--mask-count, 1) - 1) * var(--mask-index, 0));
  mask-size: calc(100vw * var(--mask-count, 8)) auto;
  mask-repeat: no-repeat;
}
</style>
