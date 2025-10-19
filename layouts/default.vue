<script setup lang="ts">
import Side from "./Side.vue";
import NewSide from "./NewSide.vue";
</script>
<template>
  <main>
    <NewSide />
    <slot />
  </main>
</template>
<style scoped>
main {
  width: 100%;
  height: 100dvh;
}
</style>
