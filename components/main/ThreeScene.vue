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

function loadModel(loader, path) {
  loader.load(
    path,
    function (gltf) {
      const model = gltf.scene; // Use gltf.scene instead of gltf
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();

      box.getCenter(center);
      model.position.sub(center);

      scene.add(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );
}

function init() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  // 카메라 위치 조정
  camera.position.z = 4;

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
  const manager = new THREE.LoadingManager();
  const loader = new GLTFLoader(manager);

  manager.onProgress = (url, loaded, total) => {
    console.log(`${(loaded / total) * 100}% 로드됨`);
  };
  manager.onLoad = () => {
    console.log("모든 모델 로드 완료");
  };

  loadModel(loader, "/models/western_city/scene.gltf");
  loadModel(loader, "/models/old_styled_wooden_info_stand/scene.gltf");

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
  paperPlane.scale.set(0.4, 0.4, 0.4);

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
