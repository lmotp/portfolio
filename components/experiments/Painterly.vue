<script setup lang="ts">
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import painterlyFragment from "@/shaders/processing/painterlyFragment.glsl";
import painterlyVertex from "@/shaders/processing/painterlyVertex.glsl";

const painterlyRef = ref<HTMLCanvasElement | null>(null);

let dpi = Math.min(window.devicePixelRatio, 2);
let width = window.innerWidth;
let height = window.innerHeight;
let aspect = width / height;

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let controls: OrbitControls;
let composer: EffectComposer;
let painterlyPass: ShaderPass;

const init = () => {
  if (!painterlyRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: painterlyRef.value, alpha: true });
  renderer.setClearColor("#3386E0");
  renderer.setSize(width, height);
  renderer.setPixelRatio(dpi);

  const size = 3;
  camera = new THREE.OrthographicCamera(-aspect * size, aspect * size, size, -size, 0.01, 500);
  camera.position.set(-3.5, 2, 10);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;

  scene = new THREE.Scene();

  setupModel();
  setupLight();
  setupPass();
  animate();
};

const setupModel = () => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

  const wrapGroup = new THREE.Group();
  wrapGroup.scale.set(0.7, 0.7, 0.7);

  const modelGroup = new THREE.Group();
  modelGroup.position.set(0, -3.5, 0);
  modelGroup.scale.set(4, 4, 4);

  const light = new THREE.DirectionalLight(0xffffff, 20.0);
  light.position.set(15, 10, -5.95);
  modelGroup.add(light);

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(usePublicAsset("/models/plant-optimized.glb"), async (gltf) => {
    const model = gltf.scene;

    await renderer.compileAsync(model, camera, scene);

    modelGroup.add(model);
    wrapGroup.add(modelGroup);
    scene.add(wrapGroup);
  });
};

const setupPass = () => {
  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  painterlyPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      kernelSize: { value: 4 },
      resolution: { value: new THREE.Vector4(width * dpi, height * dpi, 1 / (width * dpi), 1 / (height * dpi)) },
    },
    vertexShader: painterlyVertex,
    fragmentShader: painterlyFragment,
  });
  composer.addPass(painterlyPass);
};

const setupLight = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);

  scene.add(ambientLight);
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
  <canvas ref="painterlyRef"></canvas>
</template>

<style scoped></style>
