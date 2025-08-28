<script setup lang="ts">
import Side from "./Side.vue";
</script>

<template>
  <main>
    <div class="frame">
      <div class="inner">
        <Side />
        <slot />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100dvh;
}
</style>
