<script setup lang="ts">
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/examples/jsm/Addons.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

import * as dat from "lil-gui";

import vertexShader from "./shaders/plane/vertexShader.glsl";
import fragmentShader from "./shaders/plane/fragmentShader.glsl";

import customVertexShader from "./shaders/plane/effect/vertexShader.glsl";
import customFragmentShader from "./shaders/plane/effect/fragmentShader.glsl";

// const gui = new dat.GUI();
// const guiInfo = { value: 0.85 };

const clock = new THREE.Clock();

const props = defineProps<{ scrollPercentage: number; initPhysicsObj: InitPhysicsObj | null }>();
const container = ref<HTMLElement | null>(null);
const lines = ref<THREE.LineSegments[]>([]);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let effectComposer: EffectComposer;
let planeMaterial: THREE.ShaderMaterial;

const CustomEffect = {
  uniforms: {
    tDiffuse: { value: null },
  },
  vertexShader: customVertexShader,
  fragmentShader: customFragmentShader,
};

const makeLine = () => {
  // 라인 생성
  const numberOfLines = 500;
  const lineLength = 5;

  for (let i = 0; i < numberOfLines; i++) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([0, 0, 0, lineLength, 0, 0]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.LineSegments(geometry, material);

    // 초기 위치 설정 (카메라 앞에서 시작)
    line.position.set(
      (Math.random() - 0.5) * 100, // x축 범위를 줄임
      (Math.random() - 0.5) * 100, // y축 범위를 줄임
      -500 + Math.random() * 100 // z축을 카메라 뒤쪽으로 위치
    );
    line.userData.speed = Math.random() * 2 + 1; // 라인별 속도 저장

    lines.value.push(line);
    scene.add(line);
  }
};

const init = () => {
  if (!container.value) return;

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
  camera.position.z = 500;

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
  // dotPass.enabled = false;
  effectComposer.addPass(dotPass);

  const customPass = new ShaderPass(CustomEffect);
  effectComposer.addPass(customPass);

  // Add SMAA anti-aliasing pass
  if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    effectComposer.addPass(smaaPass);
  }

  // gui.add(guiInfo, "value").min(0.5).max(1).step(0.01);

  makeLine();

  // Animation
  animate();

  // Handle window resize
  window.addEventListener("resize", handleWindowResize);
};

const animate = () => {
  requestAnimationFrame(animate);

  lines.value.forEach((line) => {
    line.position.z += line.userData.speed;

    // 라인이 카메라를 지나가면 다시 멀리 보냄
    if (line.position.z > camera.position.z) {
      line.position.z = -200;
    }
  });

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

<style scoped>
.three-container {
  pointer-events: none;
}
</style>
