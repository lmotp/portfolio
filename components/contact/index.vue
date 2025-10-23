<script setup lang="ts">
import * as THREE from "three";

const cotactRef = ref<null | HTMLCanvasElement>(null);

let mesh;
let renderer;
let camera;
let scene;
let clock;

const init = () => {};

const animate = () => {};

onMounted(() => {
  nextTick(() => {
    init();
  });
});

onUnmounted(() => {});
</script>

<template>
  <div>
    <canvas ref="cotactRef" />
  </div>
</template>

<style scoped></style>
