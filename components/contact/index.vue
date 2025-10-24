<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import vertexShader from "@/shaders/contact/vertex.glsl";
import fragmentShader from "@/shaders/contact/fragment.glsl";

const cotactRef = ref<null | HTMLCanvasElement>(null);
const minPan = new THREE.Vector3(-10, -29, -Infinity);
const maxPan = new THREE.Vector3(10, 29, Infinity);
const target = new THREE.Vector3();
const mouse = new THREE.Vector2();

let geometry: THREE.PlaneGeometry;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;

let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;

const clock = new THREE.Clock();
let controls: OrbitControls;

const init = () => {
  if (!cotactRef.value) return;

  renderer = new THREE.WebGLRenderer({
    canvas: cotactRef.value,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xff0000, 1);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 50);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.enableDamping = true;

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  controls.addEventListener("change", () => {
    target.copy(controls.target);
    controls.target.clamp(minPan, maxPan);
    target.sub(controls.target);
    camera.position.sub(target);
  });

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/images/contact/cover.jpg", (texture) => {
    geometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uNoise: { value: textureLoader.load("/images/contact/noise.jpg") },
        uMouse: { value: mouse },
        uCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0.35 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader,
      fragmentShader,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
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
  <div class="contact" @mousemove="handleMouseMove">
    <canvas ref="cotactRef" />
  </div>
</template>

<style scoped>
.contact {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
