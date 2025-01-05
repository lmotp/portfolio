<script setup>
import Lenis from "lenis";

import * as THREE from "three";
import * as dat from "lil-gui";

import flipFragmentShader from "~/shaders/flip/fragment.glsl";
import flipVertexShader from "~/shaders/flip/vertex.glsl";

import paperFragmentShader from "~/shaders/paper/fragment.glsl";
import paperVertexShader from "~/shaders/paper/vertex.glsl";

import { OrbitControls } from "three/examples/jsm/Addons.js";

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

let paperPlane;
let paperGeometry;
let paperMaterial;
let lenis;

const scroll = {
  scrollY: 0,
  scrollVelocity: 0,
};

// Debug
const gui = new dat.GUI();
const settings = {
  progressX: 0,
  progressY: 0,
};

gui.add(settings, "progressX").min(0).max(1).step(0.01);
gui.add(settings, "progressY").min(0).max(1).step(0.01);

function getNormalizedScrollProgress() {
  const scrollTop = lenis.scroll;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  const scrollProgress = scrollTop / (scrollHeight - clientHeight);
  return Math.min(Math.max(scrollProgress, 0), 1);
}

function lenisInit() {
  lenis = new Lenis();

  lenis.on("scroll", (e) => {
    const normalizedProgress = getNormalizedScrollProgress();
    scroll.scrollY = normalizedProgress;
    scroll.scrollVelocity = e.velocity;
  });
}

function init() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  camera.position.z = 3; // 카메라 위치 조정

  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  clock = new THREE.Clock();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0b0d);
  container.value?.appendChild(renderer.domElement);

  // controls = new OrbitControls(camera, renderer.domElement);

  // 배경
  bgGeometry = new THREE.PlaneGeometry(2, 2);
  bgMaterial = new THREE.ShaderMaterial({
    vertexShader: flipVertexShader,
    fragmentShader: flipFragmentShader,
    uniforms: {
      uTime: { type: "f", value: 0 },
      uMouse: { type: "v2", value: new THREE.Vector2() },
      uProgress: { type: "v2", value: new THREE.Vector2(settings.progressX, settings.progressY) },
      resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
  });

  bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);

  bgPlane.position.z = -1;

  const distance = Math.abs(camera.position.z - bgPlane.position.z);
  const vFov = (camera.fov * Math.PI) / 180;
  const planeHeight = 2 * Math.tan(vFov / 2) * distance;
  const planeWidth = planeHeight * camera.aspect;

  bgPlane.scale.set(planeWidth, planeHeight, 1);

  // 종이
  paperGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  paperMaterial = new THREE.ShaderMaterial({
    vertexShader: paperVertexShader,
    fragmentShader: paperFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { type: "f", value: 0 },
      uScrollY: { type: "f", value: 0 },
      uMouse: { type: "v2", value: new THREE.Vector2() },
      resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
  });

  paperPlane = new THREE.Mesh(paperGeometry, paperMaterial);

  scene.add(paperPlane);
  scene.add(bgPlane);
}

function animate(time) {
  requestAnimationFrame(animate);

  if (lenis) lenis.raf(time);

  bgMaterial.uniforms.uTime.value = clock.getElapsedTime();
  bgMaterial.uniforms.uProgress.value = new THREE.Vector2(settings.progressX, settings.progressY);

  paperMaterial.uniforms.uScrollY.value = scroll.scrollY;
  paperPlane.rotation.y = scroll.scrollY * Math.PI;

  // render;
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();
  lenisInit();
});

onUnmounted(() => {
  renderer.dispose();
});
</script>

<template>
  <div ref="container" style="height: 300vh"></div>
</template>

<style>
canvas {
  position: fixed;
  inset: 0;
}
</style>
