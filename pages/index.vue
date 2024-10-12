<script setup lang="ts">
const isLoading = ref(true);

const handleOnLoad = async () => {
  // await useDelay(5000);
  // isLoading.value = false;
};
</script>

<template>
  <div>
    <!-- <Loading v-if="isLoading" />
    <ThreeScene @on-load="handleOnLoad" /> -->
    <MatterCanvas />
  </div>
</template>

<style scoped></style>
