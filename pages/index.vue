<script setup lang="ts">
const isLoading = ref(false);
const viewRef = ref<HTMLElement | null>(null);

const handleOnLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <section ref="viewRef">
    <Loading v-if="isLoading" @onLoad="handleOnLoad" />
    <Main :view-ref="viewRef" v-else />
  </section>
</template>

<style scoped>
section {
  width: 100%;
}
</style>
