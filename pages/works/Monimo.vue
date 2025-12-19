<script setup lang="ts">
const config = {
  id: 0,
  title: "모니모",
  desc: "모니모",
  date: "2023.07.10 ~ 2024.04.10",
  contribution: 50,
  stack: ["Nuxt3", "StoryBook", "SCSS", "Chart.js"],
};
</script>

<template>
  <Works :config="config" />
</template>

<style scoped></style>
