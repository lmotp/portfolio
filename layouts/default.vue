<script setup lang="ts">
import Side from "./Side.vue";
</script>
<template>
  <main>
    <Side />
    <slot />
  </main>
</template>
<style scoped>
main {
  width: 100%;
  isolation: isolate;
  overflow: clip;
}
</style>
