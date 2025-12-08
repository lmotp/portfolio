<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { RenderPixelatedPass } from "three/addons/postprocessing/RenderPixelatedPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const pixelRef = ref<HTMLCanvasElement | null>(null);
const clock = new THREE.Clock();
const gui = new dat.GUI();
const params = {
  pixelSize: 6,
};

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;

let crystalMesh: THREE.Mesh;

let controls: OrbitControls;
let composer: EffectComposer;

const init = () => {
  if (!pixelRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: pixelRef.value, alpha: true });
  renderer.setClearColor("#151729");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
  camera.position.set(0, 2 * Math.tan(Math.PI / 6), 2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;

  scene = new THREE.Scene();

  setupMesh();
  setupLight();
  setupPass();
  animate();
};

const setupMesh = () => {
  const loader = new THREE.TextureLoader();
  const texChecker = pixelTexture(loader.load("/images/experiments/processing/checker.png"));
  const texChecker2 = pixelTexture(loader.load("/images/experiments/processing/checker.png"));
  texChecker.repeat.set(3, 3);
  texChecker2.repeat.set(1.5, 1.5);

  makeBox(0.4, 0, 0, Math.PI / 4, texChecker2);
  makeBox(0.5, -0.5, -0.5, Math.PI / 4, texChecker2);

  const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshPhongMaterial({ map: texChecker }));
  planeMesh.receiveShadow = true;
  planeMesh.rotation.x = -Math.PI / 2;
  scene.add(planeMesh);

  const radius = 0.2;
  const geometry = new THREE.IcosahedronGeometry(radius);
  crystalMesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({
      color: 0x68b7e9,
      emissive: 0x4f7e8b,
      shininess: 10,
      specular: 0xffffff,
    })
  );
  crystalMesh.receiveShadow = true;
  crystalMesh.castShadow = true;
  scene.add(crystalMesh);
};
const setupLight = () => {
  scene.add(new THREE.AmbientLight(0x757f8e, 3));

  const directionalLight = new THREE.DirectionalLight(0xfffecd, 1.5);
  directionalLight.position.set(100, 100, 100);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(2048, 2048);
  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0xffc100, 10, 10, Math.PI / 16, 0.02, 2);
  spotLight.position.set(2, 2, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const target = spotLight.target;
  target.position.set(0, 0, 0);
  scene.add(target);
};
const setupPass = () => {
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const renderPixelatedPass = new RenderPixelatedPass(6, scene, camera);
  composer.addPass(renderPixelatedPass);

  gui
    .add(params, "pixelSize")
    .min(1)
    .max(16)
    .step(1)
    .onChange(() => {
      renderPixelatedPass.setPixelSize(params.pixelSize);
    });

  const outputPass = new OutputPass();
  composer.addPass(outputPass);
};

const pixelTexture = (texture: THREE.Texture) => {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const makeBox = (boxSideLength: number, x: number, z: number, rotation: number, texChecker2: THREE.Texture) => {
  const boxGeometry = new THREE.BoxGeometry(boxSideLength, boxSideLength, boxSideLength);
  const boxMaterial = new THREE.MeshPhongMaterial({ map: texChecker2 });
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.rotation.y = rotation;
  mesh.position.y = boxSideLength / 2;
  mesh.position.set(x, boxSideLength / 2 + 0.0001, z);

  scene.add(mesh);
  return mesh;
};

function easeInOutCubic(x: number) {
  return x ** 2 * 3 - x ** 3 * 2;
}

function linearStep(x: number, edge0: number, edge1: number) {
  const w = edge1 - edge0;
  const m = 1 / w;
  const y0 = -m * edge0;
  return THREE.MathUtils.clamp(y0 + m * x, 0, 1);
}

function stopGoEased(x: number, downtime: number, period: number) {
  const cycle = (x / period) | 0;
  const tween = x - cycle * period;
  const linStep = easeInOutCubic(linearStep(tween, downtime, period));
  return cycle + linStep;
}

const animate = () => {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  crystalMesh.position.y = 0.7 + Math.sin(t * 2) * 0.05;
  crystalMesh.rotation.y = stopGoEased(t, 2, 4) * 2 * Math.PI;

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
