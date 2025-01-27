<script setup>
import * as THREE from "three";
import * as dat from "lil-gui";

import bgFragmentShader from "~/shaders/bg/fragment.glsl";
import bgVertexShader from "~/shaders/bg/vertex.glsl";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import bg1 from "@/assets/images/western/bg_2.jpg";

const emits = defineEmits(["onLoad"]);

const container = ref(null);
let scene;
let camera;
let renderer;
let clock;
let controls;

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

function init() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  scene = new THREE.Scene();

  // 카메라 설정
  // camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 4;
  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  clock = new THREE.Clock();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  container.value?.appendChild(renderer.domElement);

  // 조명 설정
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  // // models ////////////////////////////
  // 배경
  bgGeometry = new THREE.PlaneGeometry(2, 2);
  bgMaterial = new THREE.ShaderMaterial({
    vertexShader: bgVertexShader,
    fragmentShader: bgFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uProgress: { value: new THREE.Vector2(settings.progressX, settings.progressY) },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
  });

  bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);

  scene.add(bgPlane);
}

function animate(time) {
  requestAnimationFrame(animate);

  bgMaterial.uniforms.uProgress.value = new THREE.Vector2(settings.progressX, settings.progressY);

  // render;
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  renderer.dispose();
});
</script>

<template>
  <div ref="container"></div>
</template>

<style>
canvas {
  position: fixed;
  inset: 0;
}
</style>
