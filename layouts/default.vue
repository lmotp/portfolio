<script setup lang="ts">
import Side from "./Side.vue";
</script>
<template>
  <main>
    <slot />
    <Side />
  </main>
</template>
<style scoped>
main {
  width: 100%;
  height: 100dvh;
}
</style>
