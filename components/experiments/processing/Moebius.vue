<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import moebiusFragment from "@/shaders/processing/moebiusFragment.glsl";
import moebiusVertex from "@/shaders/processing/moebiusVertex.glsl";

const MoebiusRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer;
let depthRenderTarget: THREE.WebGLRenderTarget;
let depthTexture: THREE.DepthTexture;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;

let plane: THREE.Mesh;
let composer: EffectComposer;

const init = () => {
  if (!MoebiusRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: MoebiusRef.value });
  renderer.setClearColor("#1B43BA");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);
  depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  depthRenderTarget.texture.format = THREE.RGBFormat;
  depthRenderTarget.texture.minFilter = THREE.NearestFilter;
  depthRenderTarget.texture.magFilter = THREE.NearestFilter;
  depthRenderTarget.texture.generateMipmaps = false;
  depthRenderTarget.stencilBuffer = false;
  depthRenderTarget.depthBuffer = true;
  depthRenderTarget.depthTexture = depthTexture;
  depthRenderTarget.depthTexture.type = THREE.UnsignedShortType;

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 50);
  camera.position.z = 4;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene = new THREE.Scene();

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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  const light = new THREE.DirectionalLight(0xffffff, 4.5);
  light.castShadow = true;
  light.position.set(10, 10, 10);
  light.target = plane;

  scene.add(ambientLight);
  scene.add(light);
};

const setupPass = () => {
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const moebiusPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      cameraNear: { value: 0 },
      cameraFar: { value: 0 },
    },
    fragmentShader: moebiusFragment,
    vertexShader: moebiusVertex,
  });

  moebiusPass.uniforms.cameraNear.value = camera.near;
  moebiusPass.uniforms.cameraFar.value = camera.far;
  moebiusPass.uniforms.tDepth.value = depthRenderTarget.depthTexture;

  composer.addPass(renderPass);
  composer.addPass(moebiusPass);
};

const animate = () => {
  requestAnimationFrame(animate);

  renderer.setRenderTarget(depthRenderTarget);
  renderer.render(scene, camera);

  controls.update();

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
