<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import pixelFragment from "@/shaders/processing/pixelFragment.glsl";
import pixelVertex from "@/shaders/processing/pixelVertex.glsl";

const pixelRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;

let mesh: THREE.Mesh;

let controls: OrbitControls;
let composer: EffectComposer;

const init = () => {
  if (!pixelRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: pixelRef.value, alpha: true });
  renderer.setClearColor("#ffffff");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;

  const aspect = window.innerWidth / window.innerHeight;
  const size = 3;
  camera = new THREE.OrthographicCamera(-size * aspect, size * aspect, size, -size, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(-0, 0, -5);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;

  scene = new THREE.Scene();

  setupMesh();
  setupLight();
  setupPass();
  animate();
};

const setupMesh = () => {
  const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
  const material = new THREE.MeshStandardMaterial({ color: "orange" });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};
const setupLight = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  const light = new THREE.DirectionalLight(0xffffff, 8.0);
  light.position.set(5, 10, -5);
  scene.add(ambientLight);
  scene.add(light);
};
const setupPass = () => {
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const pixelPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      pixelSize: { value: 5.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: pixelVertex,
    fragmentShader: pixelFragment,
  });
  composer.addPass(pixelPass);
};

const animate = () => {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  composer.render();
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <canvas ref="pixelRef"></canvas>
</template>

<style scoped></style>
