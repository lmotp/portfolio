<script setup lang="ts">
const isLoading = ref(false);

const handleOnLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <section>
    <ClientOnly>
      <MainLoading v-if="isLoading" @onLoad="handleOnLoad" />
      <Main v-else />
    </ClientOnly>
  </section>
</template>

<style scoped>
section {
  position: relative;
  width: 100%;
  height: 100dvh;
}
</style>
