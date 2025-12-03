<script setup lang="ts">
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import dotFragment from "@/shaders/processing/dotFragment.glsl";
import dotVertex from "@/shaders/processing/dotVertex.glsl";

const dotRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;

let controls: OrbitControls;
let composer: EffectComposer;

const init = () => {
  if (!dotRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: dotRef.value, alpha: true });
  renderer.setClearColor("#010101");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;

  const aspect = window.innerWidth / window.innerHeight;
  const size = 0.8;
  camera = new THREE.OrthographicCamera(-size * aspect, size * aspect, size, -size, 0.1, 1000);
  camera.position.set(-0, 2, -5);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
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

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load("/models/the_creation_of_adam.glb", async (gltf) => {
    const model = gltf.scene;
    model.position.set(2.25, -2, 0);
    model.rotation.y = -Math.PI / 2;
    model.scale.setScalar(4);

    await renderer.compileAsync(model, camera, scene);

    scene.add(model);
  });
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
      pixelSize: { value: 10.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: dotVertex,
    fragmentShader: dotFragment,
  });
  composer.addPass(pixelPass);
};

const animate = () => {
  requestAnimationFrame(animate);

  composer.render();
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <canvas ref="dotRef"></canvas>
</template>

<style scoped></style>
