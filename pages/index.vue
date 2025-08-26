<script setup lang="ts">
const isLoading = ref(false);

const handleOnLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <section>
    <Loading v-if="isLoading" @onLoad="handleOnLoad" />
    <Main v-else />
  </section>
</template>

<style scoped>
section {
  width: 100%;
  height: 100%;
}
</style>
