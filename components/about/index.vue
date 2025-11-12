<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import usePublicAsset from "~/composables/usePublicAsset";

import vertexShader from "@/shaders/about/vertex.glsl";
import fragmentShader from "@/shaders/about/fragment.glsl";

const aboutRef = ref<null | HTMLCanvasElement>(null);
const target = new THREE.Vector3();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();

let geometry: THREE.PlaneGeometry;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;

let mouseGeometry: THREE.SphereGeometry;
let mouseMaterial: THREE.MeshBasicMaterial;
let mouseMesh: THREE.Mesh;

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;

let controls: OrbitControls;
let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;

const init = () => {
  if (!aboutRef.value) return;

  renderer = new THREE.WebGLRenderer({
    canvas: aboutRef.value,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  scene = new THREE.Scene();

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  camera = new THREE.OrthographicCamera(
    -canvasWidth / 2,
    canvasWidth / 2,
    canvasHeight / 2,
    -canvasHeight / 2,
    1,
    1000
  );
  camera.position.set(0, 0, 50);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(usePublicAsset("/images/contact/cover.jpg"), (texture) => {
    const imageWidth = texture.image.naturalWidth;
    const imageHeight = texture.image.naturalHeight;

    geometry = new THREE.PlaneGeometry(imageWidth, imageHeight, 32, 32);
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uNoise: { value: textureLoader.load(usePublicAsset("/images/contact/noise.jpg")) },
        uMouse: { value: mouse },
        uCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0.25 },
        uTextureResolution: { value: new THREE.Vector2(texture.image.naturalWidth, texture.image.naturalHeight) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader,
      fragmentShader,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const minPan = new THREE.Vector3((-imageWidth + canvasWidth) / 2, (-imageHeight + canvasHeight) / 2, -Infinity);
    const maxPan = new THREE.Vector3((imageWidth - canvasWidth) / 2, (imageHeight - canvasHeight) / 2, Infinity);

    controls.addEventListener("change", () => {
      target.copy(controls.target);
      controls.target.clamp(minPan, maxPan);
      target.sub(controls.target);
      camera.position.sub(target);
    });
  });

  // mouseGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  // mouseMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
  // scene.add(mouseMesh);
};

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const animate = () => {
  renderer.render(scene, camera);

  controls.update();

  requestAnimationFrame(animate);
};

onMounted(() => {
  nextTick(() => {
    init();
    animate();
  });
});
</script>

<template>
  <div class="about" @mousemove="handleMouseMove">
    <canvas ref="aboutRef" />
  </div>
</template>

<style scoped>
.about {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
