<script setup lang="ts">
import * as THREE from "three";
import { PlaneShader } from "@/shaders/PlaneShader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/Addons.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

const props = defineProps<{
  scrollPercentage: number;
  physicsCanvas: { canvas: HTMLCanvasElement; count: number } | undefined;
}>();
const container = ref<HTMLElement | null>(null);
const imgTexture = ref("/images/plane/windows98.png");
const physicsTexture = ref<THREE.Texture | undefined>(undefined);
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
      uColor: { value: new THREE.Color(0xffffff) },
      uSpeed: { value: 0.5 },
      uScale: { value: 10.0 },
      uPercentage: { value: props.scrollPercentage },
      uTexture: { value: null },
    },
    vertexShader: PlaneShader.vertexShader,
    fragmentShader: PlaneShader.fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
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

  const glitchPass = new GlitchPass();
  glitchPass.goWild = false;
  effectComposer.addPass(glitchPass);

  // Add SMAA anti-aliasing pass
  if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    effectComposer.addPass(smaaPass);
  }

  // Animation
  animate();

  // Handle window resize
  window.addEventListener("resize", handleWindowResize);
};

const animate = () => {
  requestAnimationFrame(animate);

  // Update uniforms
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
  () => props.physicsCanvas,
  (canvas) => {
    if (!canvas) return;

    const canvasTexture = new THREE.CanvasTexture(canvas.canvas);
    canvasTexture.needsUpdate = true;

    planeMaterial.uniforms.uTexture.value = canvasTexture;
    planeMaterial.uniforms.uTexture.value.needsUpdate = true;
  },
  {
    deep: true,
  }
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
  <div ref="physicsCanvas" class="physics-container"></div>
</template>

<style scoped></style>
