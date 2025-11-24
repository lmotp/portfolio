<script setup lang="ts">
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import { PencilLinesPass } from "./PencilLinesPass";

const processingRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls | TrackballControls;

let light: THREE.DirectionalLight;
let composer: EffectComposer;

let geometry: THREE.TorusKnotGeometry | THREE.SphereGeometry;
let material: THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;
let mesh: THREE.Mesh;

let normalMaterial: THREE.MeshNormalMaterial;

const init = () => {
  if (!processingRef.value) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;

  renderer = new THREE.WebGLRenderer({ canvas: processingRef.value });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;

  camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
  camera.position.set(10, 5, 10);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);

  scene = new THREE.Scene();

  light = new THREE.DirectionalLight(0xffffff, 1);
  light.castShadow = true;
  light.position.set(2, 2, 2);
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);

  geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32);
  material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 1, 0);
  mesh.castShadow = true;
  scene.add(mesh);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.75;
  scene.add(plane);

  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const pencilLinePass = new PencilLinesPass(scene, camera);
  composer.addPass(renderPass);
  composer.addPass(pencilLinePass);

  animate();
};

const animate = () => {
  requestAnimationFrame(animate);

  controls.update();

  composer.render();
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <canvas ref="processingRef"></canvas>
</template>

<style scoped></style>
