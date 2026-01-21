<script setup lang="ts">
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import pencilFragment from "@/shaders/processing/pencilFragment.glsl";
import pencilVertex from "@/shaders/processing/pencilVertex.glsl";

const processingRef = ref<HTMLCanvasElement | null>(null);
const rafId = ref<number | null>(null);

let renderer: THREE.WebGLRenderer;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls | TrackballControls;

let composer: EffectComposer;
let pencilLinePass: ShaderPass;
let normalBuffer: THREE.WebGLRenderTarget;
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
  controls.maxPolarAngle = Math.PI / 2;

  scene = new THREE.Scene();

  normalMaterial = new THREE.MeshNormalMaterial();

  setupMesh();
  setupLight();
  setupPass();
  animate();
};

const setupMesh = () => {
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 1, 0);
  mesh.castShadow = true;

  scene.add(mesh);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
  );
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.75;

  scene.add(plane);
};

const setupLight = () => {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.castShadow = true;
  light.position.set(2, 2, 2);
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  scene.add(light);
};

const setupPass = () => {
  normalBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  normalBuffer.texture.format = THREE.RGBAFormat;
  normalBuffer.texture.type = THREE.HalfFloatType;
  normalBuffer.texture.minFilter = THREE.NearestFilter;
  normalBuffer.texture.magFilter = THREE.NearestFilter;
  normalBuffer.texture.generateMipmaps = false;
  normalBuffer.stencilBuffer = false;

  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  pencilLinePass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uNormals: { value: null },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: pencilVertex,
    fragmentShader: pencilFragment,
  });
  composer.addPass(renderPass);
  composer.addPass(pencilLinePass);
};

const animate = () => {
  rafId.value = requestAnimationFrame(animate);

  controls.update();

  renderer.setRenderTarget(normalBuffer);
  const overrideMaterialValue = scene.overrideMaterial;

  scene.overrideMaterial = normalMaterial;
  renderer.render(scene, camera);
  scene.overrideMaterial = overrideMaterialValue;

  scene.matrixWorldNeedsUpdate = true;
  pencilLinePass.uniforms.uNormals.value = normalBuffer.texture;
  renderer.setRenderTarget(null);

  composer.render();
};

onMounted(() => {
  nextTick(init);
});

onUnmounted(() => {
  if (rafId.value) cancelAnimationFrame(rafId.value);
  if (scene) useDisposeScene(scene);
  if (composer) composer.dispose();
  if (normalBuffer) {
    normalBuffer.texture.dispose();
    normalBuffer.dispose();
  }

  renderer.renderLists.dispose();
  renderer.dispose();
});
</script>

<template>
  <canvas ref="processingRef"></canvas>
</template>

<style scoped></style>
