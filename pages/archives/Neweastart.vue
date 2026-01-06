<script setup lang="ts">
import { archivesData } from "~/utils/data";

const index = computed(() => archivesData.findIndex((v) => v.title === "NeweastArt"));
const config = computed(() => archivesData[index.value]);
const nextConfig = computed(() => {
  const nextIndex = archivesData.length - 1 === index.value ? 0 : index.value + 1;
  const { src, title } = archivesData[nextIndex];

  return { nextTitle: title, nextSrc: src };
});
</script>

<template>
  <Archives :config="config" :nextConfig="nextConfig" />
</template>

<style scoped></style>
