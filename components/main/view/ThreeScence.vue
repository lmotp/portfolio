<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import vertexShader from "./shaders/plane/vertexShader.glsl";
import fragmentShader from "./shaders/plane/fragmentShader.glsl";

const gui = new dat.GUI();
const guiInfo = { value: 0.85, uFrequency: 10.0, uAmplitude: 0.1 };

const clock = new THREE.Clock();

const container = ref<HTMLElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let planeMaterial: THREE.ShaderMaterial;

const init = () => {
  if (!container.value) return;

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera
  const FOV = 10;
  const aspectRatio = container.value!.clientWidth / container.value!.clientHeight;
  camera = new THREE.PerspectiveCamera(FOV, aspectRatio, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Plane
  let ang_rad = (FOV * Math.PI) / 180;
  let fov_y = camera.position.z * Math.tan(ang_rad / 2) * 2;
  const planeGeometry = new THREE.PlaneGeometry((fov_y * window.innerWidth) / window.innerHeight, fov_y, 50, 50);
  planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uFrequency: { value: 15.0 },
      uAmplitude: { value: 0.1 },
      uBlue: { value: new THREE.Color("rgb( 0, 89,	179)").convertLinearToSRGB() },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = -0.05;
  scene.add(plane);

  const closeZ = 0.5 / Math.tan((useGetXFOV(camera) * Math.PI) / 180.0);
  planeMaterial.uniforms.uZMax = new THREE.Uniform(camera.position.z - closeZ);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value.appendChild(renderer.domElement);

  gui.add(guiInfo, "uFrequency").min(1).max(100).step(0.1);
  gui.add(guiInfo, "uAmplitude").min(0).max(1).step(0.01);

  // Animation
  animate();

  // Handle window resize
  window.addEventListener("resize", handleWindowResize);
};

const animate = () => {
  requestAnimationFrame(animate);
  planeMaterial.uniforms.uTime.value += 0.05;

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
