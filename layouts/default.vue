<script setup lang="ts"></script>

<template>
  <main>
    <div class="frame">
      <section class="inner">
        <slot />
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 300dvh;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .frame {
    position: fixed;
    inset: 0;
    border: 15px solid #fff;
    z-index: 101;

    .inner {
      position: relative;
      width: 100%;
      height: 100%;

      clip-path: inset(0 0 round 15px 15px 15px 15px);
      filter: drop-shadow(0 0 0 white);
      background-color: white;
      overflow: hidden;
    }
  }
}
</style>
