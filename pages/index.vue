<script setup lang="ts">
const isLoading = ref(false);

const handleOnLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <div>
    <ClientOnly>
      <MainLoading v-if="isLoading" @onLoad="handleOnLoad" />
      <Main v-else />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
