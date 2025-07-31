<script setup lang="ts">
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/examples/jsm/Addons.js";

import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

import * as dat from "lil-gui";

import vertexShader from "./shaders/plane/vertexShader.glsl";
import fragmentShader from "./shaders/plane/fragmentShader.glsl";

// const gui = new dat.GUI();
// const guiInfo = { value: 0.85 };

const clock = new THREE.Clock();

const props = defineProps<{ scrollPercentage: number; initPhysicsObj: InitPhysicsObj | null }>();
const container = ref<HTMLElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let effectComposer: EffectComposer;
let planeMaterial: THREE.ShaderMaterial;

const init = () => {
  if (!container.value) return;

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  camera.position.z = 1;

  // Plane
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uProgress: { value: 0.85 },
      uPercentage: { value: 0.0 },
      uTexture: { value: null },
    },
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value.appendChild(renderer.domElement);

  const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    samples: renderer.getPixelRatio() === 1 ? 2 : 0,
  });

  effectComposer = new EffectComposer(renderer, renderTarget);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effectComposer.setSize(container.value!.clientWidth, container.value!.clientHeight);

  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  const dotPass = new DotScreenPass() as any;
  dotPass.uniforms["scale"].value = 2;
  dotPass.uniforms["angle"].value = THREE.MathUtils.degToRad(45);
  effectComposer.addPass(dotPass);

  // Add SMAA anti-aliasing pass
  if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    effectComposer.addPass(smaaPass);
  }

  // gui.add(guiInfo, "value").min(0.5).max(1).step(0.01);

  // Animation
  animate();

  // Handle window resize
  window.addEventListener("resize", handleWindowResize);
};

const animate = () => {
  requestAnimationFrame(animate);

  // Update uniforms
  planeMaterial.uniforms.uTime.value = clock.getElapsedTime();
  planeMaterial.uniforms.uPercentage.value = props.scrollPercentage;

  // Render effect composer
  effectComposer.render();
};

const handleWindowResize = () => {
  if (!container.value) return;

  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  effectComposer.setSize(container.value.clientWidth, container.value.clientHeight);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update SMAA pass if exists
  const smaaPass = effectComposer.passes.find((pass) => pass instanceof SMAAPass);
  if (smaaPass) {
    (smaaPass as SMAAPass).setSize(container.value.clientWidth, container.value.clientHeight);
  }
};

watch(
  () => props.initPhysicsObj,
  (obj) => {
    if (obj) {
      // 물리 엔진 업데이트 후 캔버스 텍스처 업데이트
      const { Events, canvas, engine } = obj;

      Events.on(engine, "afterUpdate", () => {
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.needsUpdate = true;
        planeMaterial.uniforms.uTexture.value = canvasTexture;
      });
    }
  },
  { immediate: true }
);

onMounted(() => {
  init();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
});
</script>

<template>
  <div ref="container" class="three-container"></div>
</template>

<style scoped></style>
