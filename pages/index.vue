<script setup lang="ts">
const isLoading = ref(false);

const handleOnLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <ClientOnly>
    <MainLoading v-if="isLoading" @onLoad="handleOnLoad" />
    <Main v-else />
  </ClientOnly>
</template>

<style scoped></style>
