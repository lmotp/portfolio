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

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .frame {
    position: fixed;
    inset: 0;
    border: var(--frame) solid #fff;
    z-index: 101;

    .inner {
      position: relative;
      width: 100%;
      height: 100%;

      clip-path: inset(0 0 round var(--frame) var(--frame) var(--frame) var(--frame));
      background-color: #fff;
      box-shadow: inset 0px 4px 10px rgba(11, 13, 15, 0.2);
      overflow: hidden;
    }
  }
}
</style>
