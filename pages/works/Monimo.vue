<script setup lang="ts">
const config = {
  id: 0,
  title: "Monimo",
  desc: "모니모",
  date: "2023.07.10 ~ 2024.04.10",
  stack: ["Nuxt", "Storybook", "SCSS", "Chart"],
  mainImg: {
    src: "https://www.datocms-assets.com/136821/1724083284-highresstills_thelineanimation_azukielementals_09.jpeg?fit=crop&h=1928&w=3424",
    type: "image",
  },
};
</script>

<template>
  <Works :config="config" />
</template>

<style scoped></style>
