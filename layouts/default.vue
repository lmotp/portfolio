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
    border-radius: 12px;
    background-color: #0c0a09;
    overflow: hidden;
  }
}
</style>
