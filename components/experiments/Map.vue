<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import { OrbitControls } from "three/examples/jsm/Addons.js";

import vertexShader from "@/shaders/map/vertex.glsl";
import fragmentShader from "@/shaders/map/SobelFragment.glsl";

import usePublicAsset from "~/composables/usePublicAsset";

const aboutRef = ref<null | HTMLCanvasElement>(null);
const target = new THREE.Vector3();
const mouseForShader = new THREE.Vector2(0.5, 0.5); // 0 ~ 1 (새로운 방식)
const clock = new THREE.Clock();
const gui = new dat.GUI();
const guiObject = {
  threshold: 0.5,
  radius: 0.01,
};

let geometry: THREE.PlaneGeometry;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;

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
  textureLoader.load(usePublicAsset("/images/experiments/map/cover.jpg"), (texture) => {
    const imageWidth = texture.image.naturalWidth;
    const imageHeight = texture.image.naturalHeight;

    geometry = new THREE.PlaneGeometry(imageWidth, imageHeight, 32, 32);
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uMouse: { value: mouseForShader },
        uRadius: { value: 0.01 },
        uResolution: { value: new THREE.Vector2(canvasWidth, canvasHeight) },
        uThreshold: { value: guiObject.threshold },
      },
      vertexShader,
      fragmentShader,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const OFFSET = 10;
    const minPan = new THREE.Vector3(
      (-imageWidth + canvasWidth) / 2 + OFFSET,
      (-imageHeight + canvasHeight) / 2 + OFFSET,
      -Infinity
    );
    const maxPan = new THREE.Vector3(
      (imageWidth - canvasWidth) / 2 - OFFSET,
      (imageHeight - canvasHeight) / 2 - OFFSET,
      Infinity
    );

    controls.addEventListener("change", () => {
      target.copy(controls.target);
      controls.target.clamp(minPan, maxPan);
      target.sub(controls.target);
      camera.position.sub(target);
    });
  });

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

  gui.add(guiObject, "threshold", 0, 1, 0.01);
  gui.add(guiObject, "radius", 0, 1, 0.01);
};

const handleMouseMove = (event: MouseEvent) => {
  mouseForShader.x = event.clientX / window.innerWidth;
  mouseForShader.y = 1.0 - event.clientY / window.innerHeight;
};

const animate = (time?: DOMHighResTimeStamp) => {
  requestAnimationFrame(animate);

  controls.update();

  if (material && time) {
    material.uniforms.uThreshold.value = guiObject.threshold;
    material.uniforms.uTime.value = time * 0.05;
    material.uniforms.uRadius.value = guiObject.radius;
  }

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
