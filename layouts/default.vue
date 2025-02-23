<script setup lang="ts"></script>

<template>
  <main>
    <div class="inner">
      <slot />
    </div>
  </main>
</template>

<style scoped>
main {
  position: fixed;
  inset: 0;
  border: 15px solid #fff;
  background-color: white;
  z-index: 9999;

  .inner {
    position: relative;
    width: 100%;
    height: 100%;

    clip-path: inset(0 0 round 12px 12px 12px 12px);
    filter: drop-shadow(0 0 0 white);
    background-color: #0c0a09;
    overflow: hidden;
  }
}
</style>
