<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import moebiusFragment from "@/shaders/processing/moebiusFragment.glsl";
import moebiusVertex from "@/shaders/processing/moebiusVertex.glsl";
import customNormalFragment from "@/shaders/processing/customNormalFragment.glsl";
import customNormalVertex from "@/shaders/processing/customNormalVertex.glsl";

const MoebiusRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer;
let depthTexture: THREE.DepthTexture;
let depthRenderTarget: THREE.WebGLRenderTarget;
let normalRenderTarget: THREE.WebGLRenderTarget;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let light: THREE.DirectionalLight;

let plane: THREE.Mesh;
let customNormalMaterial: THREE.ShaderMaterial;
let composer: EffectComposer;

const gui = new dat.GUI();
const params = {
  x: 10,
  y: 10,
  z: 10,
};

const init = () => {
  if (!MoebiusRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: MoebiusRef.value });
  renderer.setClearColor("#1B43BA");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);
  depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  depthRenderTarget.depthBuffer = true;
  depthRenderTarget.depthTexture = depthTexture;

  normalRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  customNormalMaterial = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: customNormalVertex,
    fragmentShader: customNormalFragment,
  });

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 200);
  camera.position.set(1, 5, 10);

  scene = new THREE.Scene();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  gui.add(params, "x", 0, 10, 1);
  gui.add(params, "y", 0, 10, 1);
  gui.add(params, "z", 0, 10, 1);

  setupMesh();
  setupLight();
  setupPass();

  animate();
};

const setupMesh = () => {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: "orange" });
  const sphere = new THREE.Mesh(sphereGeometry, material);
  sphere.position.set(-1, 2, 1);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "hotpink" });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(2, 0.75, 2);
  box.rotation.set(0, Math.PI / 3, 0);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);

  const planeGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: "white" });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);
};

const setupLight = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  light = new THREE.DirectionalLight(0xffffff, 5);
  light.castShadow = true;
  light.position.set(10, 10, 10);
  light.target = plane;

  scene.add(ambientLight);
  scene.add(light);
};

const setupPass = () => {
  composer = new EffectComposer(renderer);
  const dpi = Math.min(window.devicePixelRatio, 2);
  const renderPass = new RenderPass(scene, camera);
  const moebiusPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      tNormal: { value: null },
      cameraNear: { value: 0 },
      cameraFar: { value: 0 },
      resolution: { value: new THREE.Vector2() },
    },
    fragmentShader: moebiusFragment,
    vertexShader: moebiusVertex,
  });

  moebiusPass.uniforms.cameraNear.value = camera.near;
  moebiusPass.uniforms.cameraFar.value = camera.far;
  moebiusPass.uniforms.tDepth.value = depthRenderTarget.depthTexture;
  moebiusPass.uniforms.tNormal.value = normalRenderTarget.texture;
  moebiusPass.uniforms.resolution.value.set(window.innerWidth * dpi, window.innerHeight * dpi);

  composer.addPass(renderPass);
  composer.addPass(moebiusPass);
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();

  renderer.setRenderTarget(depthRenderTarget);
  renderer.render(scene, camera);

  const originalSceneMaterial = scene.overrideMaterial;
  renderer.setRenderTarget(normalRenderTarget);

  scene.matrixWorldNeedsUpdate = true;
  scene.overrideMaterial = customNormalMaterial;
  renderer.render(scene, camera);

  scene.overrideMaterial = originalSceneMaterial;

  renderer.setRenderTarget(null);

  composer.render();
};

onMounted(() => {
  init();
});
</script>

<template>
  <canvas ref="MoebiusRef"></canvas>
</template>

<style scoped></style>
