<script setup lang="ts">
import Intro from "./intro/index.vue";
import Outro from "./outro/index.vue";

const { viewRef } = defineProps<{ viewRef: HTMLElement | null }>();
</script>

<template>
  <Intro :view-ref="viewRef" />
  <Outro />
</template>

<style scoped></style>
