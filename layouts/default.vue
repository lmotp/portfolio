<script setup lang="ts"></script>

<template>
  <main>
    <section class="inner">
      <slot />
    </section>
  </main>
</template>

<style scoped>
main {
  position: fixed;
  inset: 0;
  border: 15px solid #fff;
  z-index: 9999;

  .inner {
    position: relative;
    width: 100%;
    height: 100%;

    clip-path: inset(0 0 round 15px 15px 15px 15px);
    filter: drop-shadow(0 0 0 white);
    background-color: #0c0a09;
    overflow: hidden;
  }
}
</style>
