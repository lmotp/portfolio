<script setup lang="ts">
const meteor = computed(() => {
  return [...Array.from({ length: 20 })].map(() => ({
    top: "-5px",
    left: Math.floor(Math.random() * window.innerWidth) + "px",
    animationDelay: Math.random() * 1 + 0.5 + "s",
    animationDuration: Math.floor(Math.random() * 10 + 2.5) + "s",
  }));
});
</script>

<template>
  <div class="container">
    <div class="meteors-wrap">
      <span v-for="(s, i) of meteor" :key="i" :style="s" class="wrapper">
        <div class="tail" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #0b0d0f;

  .meteors-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    .wrapper {
      --tw-shadow: 0 0 0 1px #ffffff10;
      --tw-ring-shadow: 0 0 #0000;
      position: absolute;
      width: 2px;
      height: 2px;
      border-radius: 99999px;
      background-color: #a1a1aa;
      box-shadow: var(--tw-ring-shadow), var(--tw-ring-shadow), var(--tw-shadow);
      pointer-events: none;
      isolation: isolate;

      animation: meteor 5s linear infinite forwards;

      .tail {
        position: absolute;
        top: 50%;
        width: 50px;
        height: 1px;
        background-image: linear-gradient(to right, rgb(161, 161, 170), rgba(0, 0, 0, 0));
        z-index: -10;
      }
    }
  }
}

@keyframes meteor {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(215deg) translateX(-1000px);
    opacity: 0;
  }
}
</style>
