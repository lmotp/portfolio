<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import { OrbitControls } from "three/examples/jsm/Addons.js";

import vertexShader from "@/shaders/about/vertex.glsl";
import fragmentShader from "@/shaders/about/SobelFragment.glsl";

import usePublicAsset from "~/composables/usePublicAsset";

const aboutRef = ref<null | HTMLCanvasElement>(null);
const target = new THREE.Vector3();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
const gui = new dat.GUI();
const guiObject = {
  threshold: 1,
};

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

const init = () => {
  if (!aboutRef.value) return;

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(
    -canvasWidth / 2,
    canvasWidth / 2,
    canvasHeight / 2,
    -canvasHeight / 2,
    1,
    1000
  );
  camera.position.set(0, 0, 100);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(usePublicAsset("/images/about/map.png"), (texture) => {
    const imageWidth = texture.image.naturalWidth;
    const imageHeight = texture.image.naturalHeight;
    const dpi = renderer.getPixelRatio();

    geometry = new THREE.PlaneGeometry(imageWidth, imageHeight, 32, 32);
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: mouse },
        uRadius: { value: 0.25 },
        uResolution: { value: new THREE.Vector2(window.innerWidth * dpi, window.innerHeight * dpi) },
        uThreshold: { value: guiObject.threshold },
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

  renderer = new THREE.WebGLRenderer({
    canvas: aboutRef.value,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvasWidth, canvasHeight);

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
};

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const animate = () => {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
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
