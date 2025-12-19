<script setup lang="ts">
const config = {
  id: 0,
  title: "Monimo",
  desc: `Nuxt 3 기반 프레임워크 전환 및 핵심 메인(자산/혜택 등) 퍼블리싱
디자인 시스템 구축 및 Storybook 기반 협업 프로세스 도입
데이터 시각화를 위한 고난도 차트 UI 구현 및 QA 대응`,
  date: `1차 / 2023.07.10 ~ 2024.04.10\n2차 / 2024.10.13 ~ 2025.06.15`,
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
