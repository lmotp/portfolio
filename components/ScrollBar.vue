<script setup lang="ts"></script>

<template>
  <div :aria-hidden="true" class="scrollbar">
    <div class="scrollbar-wrapper">
      <div class="handle"></div>
    </div>
  </div>
</template>

<style scoped>
@media (hover: hover) {
  .scrollbar {
    position: fixed;
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 999;

    &-wrapper {
      height: 100%;
      position: relative;

      .handle {
        background-color: #0b0b0b;
        cursor: grab;
        min-height: 4.62963vw;
        position: absolute;
        right: 0;
        width: 0.46296vw;
      }
    }
  }
}
</style>
