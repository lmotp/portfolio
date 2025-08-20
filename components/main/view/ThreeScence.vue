<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import vertexShader from "./shaders/plane/vertexShader.glsl";
import fragmentShader from "./shaders/plane/fragmentShader.glsl";

import effectVertexShader from "./shaders/plane/effect/vertexShader.glsl";
import effectFragmentShader from "./shaders/plane/effect/fragmentShader.glsl";

const gui = new dat.GUI();
const guiInfo = { value: 0.85, uFrequency: 4.0, uAmplitude: 0.2, y: 0 };

const clock = new THREE.Clock();

const container = ref<HTMLElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let planeMaterial: THREE.ShaderMaterial;
let plane2: THREE.Mesh;
const init = () => {
  if (!container.value) return;

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera
  const FOV = 25;
  const aspectRatio = container.value!.clientWidth / container.value!.clientHeight;
  camera = new THREE.PerspectiveCamera(FOV, aspectRatio, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Plane
  let ang_rad = (FOV * Math.PI) / 180;
  let fov_y = camera.position.z * Math.tan(ang_rad / 2) * 2;
  const planeGeometry = new THREE.PlaneGeometry((fov_y * window.innerWidth) / window.innerHeight, 0.4, 50, 50);
  planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uFrequency: { value: 4.0 },
      uAmplitude: { value: 0.2 },
      uBlue: { value: new THREE.Color("rgb( 0, 89,	179)").convertLinearToSRGB() },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, 0.65, 0.5);
  scene.add(plane);

  const planeGeometry2 = new THREE.PlaneGeometry((fov_y * window.innerWidth) / window.innerHeight, fov_y, 50, 50);
  const planeMaterial2 = new THREE.ShaderMaterial({
    vertexShader: effectVertexShader,
    fragmentShader: effectFragmentShader,
  });

  plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
  plane2.position.set(0, -0.55, 0);
  scene.add(plane2);

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
  planeMaterial.uniforms.uTime.value += 0.04;

  planeMaterial.uniforms.uFrequency.value = guiInfo.uFrequency;
  planeMaterial.uniforms.uAmplitude.value = guiInfo.uAmplitude;

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
