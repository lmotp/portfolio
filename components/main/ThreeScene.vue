<script setup>
import * as THREE from "three";
import * as dat from "lil-gui";

import paperFragmentShader from "~/shaders/paper/fragment.glsl";
import paperVertexShader from "~/shaders/paper/vertex.glsl";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const emits = defineEmits(["onLoad"]);

const container = ref(null);
let scene;
let camera;
let renderer;
let clock;
let controls;

let paperPlane;
let paperGeometry;
let paperMaterial;

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

function init() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  // 카메라 위치 조정
  camera.position.z = 1;

  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  clock = new THREE.Clock();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0b0d);
  container.value?.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  //Add light
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  // models ////////////////////////////
  const loader = new GLTFLoader();

  loader.load(
    "/models/chicken_gun_western/scene.gltf",
    function (gltf) {
      console.log(gltf);

      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

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
}

function animate(time) {
  requestAnimationFrame(animate);

  paperMaterial.uniforms.uScrollY.value = scroll.scrollY;
  paperPlane.rotation.y = scroll.scrollY * Math.PI;

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
