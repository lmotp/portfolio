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
  // const bounds = renderer.domElement.getBoundingClientRect();
  // const { clientX, clientY } = event;
  // const x = clientX - bounds.left;
  // const y = clientY - bounds.top;
  // const position = [x, y];

  // const uv = [position[0] / bounds.width, position[1] / bounds.height];

  // 0.5를 빼준 이유는 uv의 좌표를 중앙으로 옮기기 위함.
  // mouse.x = uv[0];
  // mouse.y = 1 - uv[1];

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
  console.log(scene.children.length);
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
  // const light = new THREE.AmbientLight(0xffffff);
  // scene.add(light);

  // 카메라 설정
  // camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  // camera.position.z = 1;
  camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  camera.position.set(10, 15, -22);
  scene.add(camera);

  controls = new OrbitControls(camera, renderer.domElement);

  // // models ////////////////////////////

  // 배경
  bgGeometry = new THREE.PlaneGeometry(20, 20);
  bgMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false });
  // bgMaterial = new THREE.ShaderMaterial({
  //   vertexShader: bgVertexShader,
  //   fragmentShader: bgFragmentShader,
  //   uniforms: {
  //     uTime: { value: 0 },
  //     uMouse: { value: new THREE.Vector2() },
  //     uTexture: { value: new THREE.TextureLoader().load(bg1) },
  //     uNoise: { value: new THREE.TextureLoader().load(noise2) },
  //     uProgress: { value: new THREE.Vector2(settings.progressX, settings.progressY) },
  //     uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  //   },
  // });

  bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
  bgPlane.rotateX(-Math.PI / 2);

  highlightGeometry = new THREE.PlaneGeometry(1, 1);
  highlightMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
  });
  highlightPlane = new THREE.Mesh(highlightGeometry, highlightMaterial);
  highlightPlane.rotateX(-Math.PI / 2);
  highlightPlane.position.set(0.5, 0, 0.5);

  sphereGeometry = new THREE.SphereGeometry(0.4, 4, 2);
  sphereMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffea00,
  });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  grid = new THREE.GridHelper(20, 20);

  scene.add(bgPlane);
  scene.add(grid);
  scene.add(highlightPlane);
}

// threejs 반복
function animate() {
  const time = clock.getElapsedTime();

  requestAnimationFrame(animate);

  // bgMaterial.uniforms.uTime.value = time;
  // bgMaterial.uniforms.uProgress.value = new THREE.Vector2(settings.progressX, settings.progressY);
  // bgMaterial.uniforms.uMouse.value = mouse;

  // render;
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();

  renderer.domElement.addEventListener("mousemove", handleMouseMove);
  renderer.domElement.addEventListener("mousedown", handleMouseDown);
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
