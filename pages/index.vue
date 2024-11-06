<script setup lang="ts">
const isLoading = ref(true);

const handleOnLoad = async () => {
  isLoading.value = false;
};
</script>

<template>
  <div class="container">
    <MainLoading v-if="isLoading" @onLoad="handleOnLoad" />
    <MainStars :isLoading="isLoading" />
    <MainThreeScene />
    <!-- <MainSeeds :isLoading="isLoading" /> -->
  </div>
</template>

<style scoped></style>
