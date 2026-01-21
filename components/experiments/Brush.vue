<script setup lang="ts">
import * as THREE from "three";

import vertexShader from "@/shaders/brush/vertex.glsl";
import fragmentShader from "@/shaders/brush/fragment.glsl";

const brushRef = ref<HTMLElement | null>(null);
const rafId = ref<number | null>(null);
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let time = 0;

let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;

let whiteTarget: THREE.WebGLRenderTarget;
let whiteScene: THREE.Scene;
let whiteBg: THREE.Mesh;
let box: THREE.Mesh;

let geometry: THREE.PlaneGeometry;
let material: THREE.MeshBasicMaterial;
let mesh: THREE.Mesh;

let mouseGeometry: THREE.PlaneGeometry | THREE.SphereGeometry;
let mouseMaterial: THREE.MeshBasicMaterial;
let mouseMesh: THREE.Mesh;

let targetA: THREE.WebGLRenderTarget;
let targetB: THREE.WebGLRenderTarget;

let sourceTarget: THREE.WebGLRenderTarget;
let fboScene: THREE.Scene;
let fboCamera: THREE.OrthographicCamera;
let fboMaterial: THREE.ShaderMaterial;
let fboGeometry: THREE.PlaneGeometry;
let fboQuad: THREE.Mesh;

let finalScene: THREE.Scene;
let finalQuad: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

const init = () => {
  if (!brushRef.value) return;

  renderer = new THREE.WebGLRenderer({
    canvas: brushRef.value,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvasWidth, canvasHeight);

  camera = new THREE.PerspectiveCamera(70, canvasWidth / canvasHeight, 0.1, 1000);
  camera.position.set(0, 0, 2);

  scene = new THREE.Scene();

  whiteTarget = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight);
  whiteScene = new THREE.Scene();
  whiteBg = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  whiteBg.position.set(0, 0, -1);
  whiteScene.add(whiteBg);

  box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  whiteScene.add(box);

  setupPipeline();
  mouseEvents();

  animate();
};

const setupPipeline = () => {
  sourceTarget = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight);

  targetA = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight);
  targetB = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight);

  renderer.setRenderTarget(whiteTarget);
  renderer.render(whiteScene, camera);

  fboScene = new THREE.Scene();
  fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  fboGeometry = new THREE.PlaneGeometry(2, 2);
  fboMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tPrev: { value: whiteTarget.texture },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector4(canvasWidth, canvasHeight, 1, 1) },
    },
    vertexShader,
    fragmentShader,
  });
  fboQuad = new THREE.Mesh(fboGeometry, fboMaterial);
  fboScene.add(fboQuad);

  finalScene = new THREE.Scene();
  finalQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: targetA.texture }));
  finalScene.add(finalQuad);
};

const mouseEvents = () => {
  geometry = new THREE.PlaneGeometry(100, 100, 32, 32);
  material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  mesh = new THREE.Mesh(geometry, material);

  mouseGeometry = new THREE.SphereGeometry(0.2, 20, 20);
  mouseMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
  scene.add(mouseMesh);

  window.addEventListener("mousemove", setupMouseMove);
};

const setupMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(mesh);

  if (intersects.length > 0) {
    mouseMesh.position.copy(intersects[0].point);
  }
};

const animate = () => {
  rafId.value = requestAnimationFrame(animate);

  time += 0.05;

  renderer.setRenderTarget(sourceTarget);
  renderer.render(scene, camera);

  renderer.setRenderTarget(targetA);
  renderer.render(fboScene, fboCamera);
  fboMaterial.uniforms.tDiffuse.value = sourceTarget.texture;
  fboMaterial.uniforms.tPrev.value = targetA.texture;
  fboMaterial.uniforms.uTime.value = time;

  finalQuad.material.map = targetA.texture;
  renderer.setRenderTarget(null);
  renderer.render(finalScene, fboCamera);

  let temp = targetA;
  targetA = targetB;
  targetB = temp;
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", setupMouseMove);

  const scenes = [scene, whiteScene, fboScene, finalScene];
  scenes.forEach((s) => {
    if (s) useDisposeScene(s);
  });

  const targets = [whiteTarget, sourceTarget, targetA, targetB];
  targets.forEach((t) => {
    if (t) {
      t.texture.dispose();
      t.dispose();
    }
  });

  renderer.renderLists.dispose();
  renderer.dispose();
});
</script>

<template>
  <canvas ref="brushRef"></canvas>
</template>

<style scoped></style>
