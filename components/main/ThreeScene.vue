<script setup>
import * as THREE from "three";
import * as dat from "lil-gui";

import fragmentShader from "~/shaders/flip/fragment.glsl";
import vertexShader from "~/shaders/flip/vertex.glsl";

const emits = defineEmits(["onLoad"]);

const container = ref(null);
let scene;
let camera;
let renderer;
let geometry;
let material;
let plane;
let clock;

// Debug
const gui = new dat.GUI();
const settings = {
  progressX: 0,
  progressY: 0,
};
gui.add(settings, "progressX").min(0).max(1).step(0.01);
gui.add(settings, "progressY").min(0).max(1).step(0.01);

function init() {
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  renderer = new THREE.WebGLRenderer();
  clock = new THREE.Clock();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0b0d);
  container.value?.appendChild(renderer.domElement);

  geometry = new THREE.PlaneGeometry(1, 1);
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { type: "f", value: 0 },
      progress: { type: "v2", value: new THREE.Vector2(settings.progressX, settings.progressY) },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
  });

  plane = new THREE.Mesh(geometry, material);

  scene.add(plane);
}

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.time.value = clock.getElapsedTime();
  material.uniforms.progress.value = new THREE.Vector2(settings.progressX, settings.progressY);

  // render;
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  renderer.dispose();
});
</script>

<template>
  <div ref="container"></div>
</template>
