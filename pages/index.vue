<script setup lang="ts">
const isLoading = ref(true);

const handleOnLoad = async () => {
  isLoading.value = false;
};
</script>

<template>
  <div class="container">
    <Loading v-if="isLoading" @onLoad="handleOnLoad" />
    <MatterCanvas :isLoading="isLoading" />
    <ThreeScene />
  </div>
</template>

<style scoped></style>
