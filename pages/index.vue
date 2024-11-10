<script setup lang="ts">
const isLoading = ref(true);

const handleOnLoad = async () => {
  isLoading.value = true;
};
</script>

<template>
  <div class="container">
    <ClientOnly>
      <MainLoading v-if="isLoading" @onLoad="handleOnLoad" />
    </ClientOnly>

    <MainStars :isLoading="isLoading" />
    <MainThreeScene />
    <!-- <MainSeeds :isLoading="isLoading" /> -->
  </div>
</template>

<style scoped></style>
