<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import vertexShader from "./shaders/plane/vertexShader.glsl";
import fragmentShader from "./shaders/plane/fragmentShader.glsl";

// const gui = new dat.GUI();
// const guiInfo = { value: 0.85 };

const clock = new THREE.Clock();

const container = ref<HTMLElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let planeMaterial: THREE.ShaderMaterial;

const init = () => {
  if (!container.value) return;

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
  camera.position.z = 500;

  // Plane
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      u_time: { value: 0 },
      u_blue: { value: new THREE.Color("rgb( 0, 89,	179)").convertLinearToSRGB() },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value.appendChild(renderer.domElement);

  // Animation
  animate();

  // Handle window resize
  window.addEventListener("resize", handleWindowResize);
};

const animate = () => {
  requestAnimationFrame(animate);
  planeMaterial.uniforms.u_time.value += 0.01;

  renderer.render(scene, camera);
};

const handleWindowResize = () => {
  if (!container.value) return;

  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
});
</script>

<template>
  <div ref="container" class="three-container"></div>
</template>

<style scoped></style>
