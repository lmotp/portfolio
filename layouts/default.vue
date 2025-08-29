<script setup lang="ts">
import Side from "./Side.vue";
</script>
<template>
  <main>
    <Side />
    <div class="content">
      <slot />
    </div>
  </main>
</template>
<style scoped>
main {
  width: 100%;
  height: 100dvh;

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    border: 15px solid #fff;
    box-shadow: inset 0px 4px 10px rgba(11, 13, 15, 0.2);
    z-index: 102;
    pointer-events: none;
    user-select: none;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: var(--frame);
  }
}
</style>
