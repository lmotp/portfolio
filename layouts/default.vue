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
  height: 100dvh;

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
      background-color: white;
      box-shadow: inset 0px 4px 10px rgba(11, 13, 15, 0.2);
      overflow: hidden;
    }
  }
}
</style>
