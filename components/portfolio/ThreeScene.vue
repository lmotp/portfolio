<script setup>
import * as THREE from "three";
import * as dat from "lil-gui";

import bgFragmentShader from "~/shaders/bg/fragment.glsl";
import bgVertexShader from "~/shaders/bg/vertex.glsl";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import bg1 from "@/assets/images/bg/bg_1.jpg";
import noise1 from "@/assets/images/noise/noise_1.png";
import noise2 from "@/assets/images/noise/noise_2.png";

const emits = defineEmits(["onLoad"]);

const container = ref(null);
const mouse = new THREE.Vector2();
const mouseTarget = new THREE.Vector2();

let scene;
let camera;
let renderer;
let clock;

let bgPlane;
let bgGeometry;
let bgMaterial;

// Debug
const gui = new dat.GUI();
const settings = {
  progressX: 0,
  progressY: 0,
};

gui.add(settings, "progressX").min(0).max(1).step(0.01);
gui.add(settings, "progressY").min(0).max(1).step(0.01);

// threejs 기본셋팅
function init() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // 카메라 설정
  // camera.position.z = 1;
  // camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 1, 3000);
  camera.position.set(0, 0, 800);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  clock = new THREE.Clock();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0c0a09);
  container.value?.appendChild(renderer.domElement);

  // 조명 설정
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  // // models ////////////////////////////

  // 배경
  bgGeometry = new THREE.PlaneGeometry(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
  bgMaterial = new THREE.ShaderMaterial({
    vertexShader: bgVertexShader,
    fragmentShader: bgFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uTexture: { value: new THREE.TextureLoader().load(bg1) },
      uNoise: { value: new THREE.TextureLoader().load(noise2) },
      uProgress: { value: new THREE.Vector2(settings.progressX, settings.progressY) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
  });

  bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);

  scene.add(bgPlane);
}

// threejs 반복
function animate() {
  const time = clock.getElapsedTime();

  requestAnimationFrame(animate);

  bgMaterial.uniforms.uTime.value = time;
  bgMaterial.uniforms.uProgress.value = new THREE.Vector2(settings.progressX, settings.progressY);
  bgMaterial.uniforms.uMouse.value = mouse;

  // render;
  renderer.render(scene, camera);
}

// mouseMove
function handleMouseMove(event) {
  const bounds = renderer.domElement.getBoundingClientRect();
  const { clientX, clientY } = event;
  const x = clientX - bounds.left;
  const y = clientY - bounds.top;
  const position = [x, y];

  const uv = [position[0] / bounds.width, position[1] / bounds.height];

  // 0.5를 빼준 이유는 uv의 좌표를 중앙으로 옮기기 위함.
  mouse.x = uv[0];
  mouse.y = 1 - uv[1];
}

onMounted(() => {
  init();
  animate();

  renderer.domElement.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  renderer.dispose();
  renderer.domElement.removeEventListener("mousemove", handleMouseMove);
});
</script>

<template>
  <div ref="container" class="three-container"></div>
</template>

<style>
.three-container {
  width: 100%;
  height: 100%;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
