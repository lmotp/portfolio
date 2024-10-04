<script setup lang="ts">
const isLoading = ref(true);
</script>

<template>
  <div>
    <Loading v-if="isLoading" />
    <ThreeScene />
  </div>
</template>

<style scoped></style>
