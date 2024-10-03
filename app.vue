<script setup>
const { progress, isLoading } = useLoadingIndicator();
</script>

<template>
  <NuxtLoadingIndicator ref="loadingIndicator">
    <Loading :progress="progress" :isLoading="isLoading" />
  </NuxtLoadingIndicator>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
