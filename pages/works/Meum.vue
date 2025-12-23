<script setup lang="ts">
import { workData } from "~/utils/data";

const index = computed(() => workData.findIndex((v) => v.title === "Meum"));
const config = computed(() => workData[index.value]);
const nextConfig = computed(() => {
  const nextIndex = workData.length - 1 === index.value ? 0 : index.value + 1;
  const { src, title } = workData[nextIndex];

  return { nextTitle: title, nextSrc: src };
});
</script>

<template>
  <Works :config="config" :nextConfig="nextConfig" />
</template>

<style scoped></style>
