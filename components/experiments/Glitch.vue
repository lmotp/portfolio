<script setup lang="ts">
import * as THREE from "three";

import ImageVertex from "./shaders/glitch/ImageVertex.glsl";
import ImageFragment from "./shaders/glitch/ImageFragment.glsl";

import PostEffectVertex from "./shaders/glitch/postEffectVertex.glsl";
import PostEffectFragment from "./shaders/glitch/postEffectFragment.glsl";

const glitchRef = ref<HTMLElement | null>(null);
const resolution = ref(new THREE.Vector2(document.body.clientWidth, window.innerHeight));

const clock = new THREE.Clock();
let renderer: THREE.WebGLRenderer;
let renderTarget: THREE.WebGLRenderTarget;

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;

let sceneBack: THREE.Scene;
let cameraBack: THREE.PerspectiveCamera;

let geometry: THREE.PlaneGeometry;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;

let effectGeometry: THREE.PlaneGeometry;
let effectMaterial: THREE.ShaderMaterial;
let effectMesh: THREE.Mesh;

const init = () => {
  if (!glitchRef.value) return;

  renderer = new THREE.WebGLRenderer({ antialias: false, canvas: glitchRef.value });
  renderTarget = new THREE.WebGLRenderTarget(resolution.value.x, resolution.value.y);

  renderer.setSize(resolution.value.x, resolution.value.y);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x0e0e0e, 1.0);

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
  camera.position.set(0, 0, 2);

  sceneBack = new THREE.Scene();
  cameraBack = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("@/public/images/experiments/glitch/osaka.jpg", (tex) => {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    mesh = setImagePlane(tex);
    effectMesh = setPostEffect(tex);

    sceneBack.add(mesh);
    scene.add(effectMesh);
  });
};

const setImagePlane = (imageTexture: THREE.Texture) => {
  geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
  material = new THREE.ShaderMaterial({
    uniforms: {
      resolution: { value: resolution.value },
      imageResolution: { value: new THREE.Vector2(2048, 1356) },
      uTexture: { value: imageTexture },
    },
    vertexShader: ImageVertex,
    fragmentShader: ImageFragment,
  });

  return new THREE.Mesh(geometry, material);
};

const setPostEffect = (imageTexture: THREE.Texture) => {
  effectGeometry = new THREE.PlaneGeometry(2, 2);
  effectMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: resolution.value },
      uTexture: { value: imageTexture },
    },
    vertexShader: PostEffectVertex,
    fragmentShader: PostEffectFragment,
  });

  return new THREE.Mesh(effectGeometry, effectMaterial);
};

const resizeWindow = () => {
  resolution.value.set(window.innerWidth, window.innerHeight);
  material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  effectMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);

  cameraBack.aspect = resolution.value.x / resolution.value.y;
  cameraBack.updateProjectionMatrix();

  renderer.setSize(resolution.value.x, resolution.value.y);
  renderTarget.setSize(resolution.value.x, resolution.value.y);
};

const animate = () => {
  requestAnimationFrame(animate);

  const time = clock.getDelta();
  effectMaterial.uniforms.time.value += time;

  renderer.render(scene, camera);
  renderer.setRenderTarget(renderTarget);
  renderer.render(sceneBack, cameraBack);
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
};

onMounted(() => {
  nextTick(() => {
    init();
    animate();
    window.addEventListener("resize", resizeWindow);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>

<template>
  <canvas ref="glitchRef"></canvas>
</template>

<style scoped></style>
