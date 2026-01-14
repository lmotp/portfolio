<script setup lang="ts">
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const heroRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

const init = () => {
  if (!heroRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: heroRef.value });
  renderer.setClearColor("#050505");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
</script>

<template>
  <div>
    <canvas ref="heroRef"></canvas>
  </div>
</template>

<style scoped></style>
