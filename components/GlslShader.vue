<script setup lang="ts">
import * as THREE from "three";
import fragmentShader from "~/shaders/sample/fragment.glsl";
import vertexShader from "~/shaders/sample/vertex.glsl";

const container = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;
let clock: THREE.Clock;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  clock = new THREE.Clock();

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value?.appendChild(renderer.domElement);

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
    },
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  camera.position.z = 1;
}

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.time.value = clock.getElapsedTime();
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
