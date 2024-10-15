<script setup lang="ts">
const isLoading = ref(true);

const handleOnLoad = async () => {
  // await useDelay(5000);
  // isLoading.value = false;
};
</script>

<template>
  <div class="container">
    <Loading v-if="isLoading" />
    <MatterCanvas :is-loading="isLoading" />
    <ThreeScene @on-load="handleOnLoad" />
  </div>
</template>

<style scoped></style>
