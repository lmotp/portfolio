<script setup lang="ts">
import { workData } from "~/utils/data";

const index = computed(() => workData.findIndex((v) => v.title === "Lisn"));
const config = computed(() => workData[index.value]);
const nextConfig = computed(() => {
  const nextIndex = workData.length - 1 === index.value ? 0 : index.value + 1;
  const { src, type, title } = workData[nextIndex];

  return { nextTitle: title, nextSrc: src, nextType: type };
});
</script>

<template>
  <Works :config="config" :nextConfig="nextConfig" />
</template>

<style scoped></style>
