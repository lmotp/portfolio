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
const raycaster = new THREE.Raycaster();

const objects = [];

let scene;
let camera;
let renderer;
let clock;
let controls;

let bgPlane;
let bgGeometry;
let bgMaterial;

let highlightPlane;
let highlightGeometry;
let highlightMaterial;

let sphere;
let sphereGeometry;
let sphereMaterial;

let grid;
let intersects;

// Debug
const gui = new dat.GUI();
const settings = {
  progressX: 0,
  progressY: 0,
};

gui.add(settings, "progressX").min(0).max(1).step(0.01);
gui.add(settings, "progressY").min(0).max(1).step(0.01);

// mouseMove
function handleMouseHighlight() {
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObject(bgPlane);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
    highlightPlane.position.set(highlightPos.x, 0, highlightPos.z);

    const objectExist = objects.find(function (object) {
      return object.position.x === highlightPlane.position.x && object.position.z === highlightPlane.position.z;
    });

    if (!objectExist) highlightPlane.material.color.setHex(0xffffff);
    else highlightPlane.material.color.setHex(0xff0000);
  }
}
function handleMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  handleMouseHighlight();
}
function handleMouseDown() {
  const objectExist = objects.find(function (object) {
    return object.position.x === highlightPlane.position.x && object.position.z === highlightPlane.position.z;
  });

  if (!objectExist) {
    if (intersects.length > 0) {
      const sphereClone = sphere.clone();
      sphereClone.position.copy(highlightPlane.position);
      scene.add(sphereClone);
      objects.push(sphereClone);
      highlightPlane.material.color.setHex(0xff0000);
    }
  }
}

// threejs 기본셋팅
function init() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  scene = new THREE.Scene();
  clock = new THREE.Clock();
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0c0a09);
  container.value?.appendChild(renderer.domElement);

  // 조명 설정

  // // models ////////////////////////////
  // 배경
  bgGeometry = new THREE.PlaneGeometry(1, 1, 5, 5);
  bgMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: true });
  bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);

  scene.add(bgPlane);
  // scene.add(highlightPlane);

  // 카메라 설정
  const frustumSize = 1;
  camera = new THREE.OrthographicCamera(
    frustumSize / -2,
    frustumSize / 2,
    frustumSize / 2,
    frustumSize / -2,
    -1000,
    1000
  );
  camera.position.set(0, 0, 1);
  camera.zoom = 1;
  camera.updateProjectionMatrix(); // 프로젝션 매트릭스 업데이트
  scene.add(camera);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
}

// threejs 반복
function animate() {
  const time = clock.getElapsedTime();

  requestAnimationFrame(animate);

  // render;
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();

  // renderer.domElement.addEventListener("mousemove", handleMouseMove);
  // renderer.domElement.addEventListener("mousedown", handleMouseDown);
});

onUnmounted(() => {
  renderer.dispose();
  renderer.domElement.removeEventListener("mousemove", handleMouseMove);
  renderer.domElement.removeEventListener("mousedown", handleMouseDown);
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
