<script setup lang="ts">
const isLoading = ref(true);

const handleOnLoad = async () => {
  isLoading.value = false;
};
</script>

<template>
  <div class="container">
    <ClientOnly>
      <Transition name="loading-transtion">
        <MainLoading v-if="isLoading" @onLoad="handleOnLoad" />
      </Transition>
    </ClientOnly>

    <MainStars :isLoading="!isLoading" />
    <MainThreeScene />
    <!-- <MainSeeds :isLoading="isLoading" /> -->
  </div>
</template>

<style scoped></style>
