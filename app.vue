<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition } = storeToRefs(pageTransitionStore);
</script>

<template>
  <NuxtLayout>
    <PageTransition v-show="isPageTransition" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
