<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PlaneShader } from "@/shaders/PlaneShader.js";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

const aspect = window.innerWidth / window.innerHeight;
const cameraHeight = 10; // 카메라가 볼 월드 공간의 "높이"를 정의합니다.

const container = ref<HTMLElement | null>(null);
let effectComposer: EffectComposer;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let transformControls: TransformControls;
let planeMaterial: THREE.ShaderMaterial;
let line: THREE.Mesh;
let sphere: THREE.Mesh;

// Scene 설정
const setupScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x008080);

  // ShaderMaterial 생성
  planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xffffff) },
      uTime: { value: 0.0 },
      uSpeed: { value: 0.5 },
      uScale: { value: 10.0 },
      uTexture: { value: new THREE.TextureLoader().load("/images/plane/windows98.png") },
    },
    vertexShader: PlaneShader.vertexShader,
    fragmentShader: PlaneShader.fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
  });

  // 화면 전체를 채우는 plane 생성
  const planeGeometry = new THREE.PlaneGeometry(cameraHeight * aspect, cameraHeight);
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.z = -0.251;
  scene.add(plane);

  const lineGeometry = new THREE.BoxGeometry(10, 0.25, 0.5);
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  line = new THREE.Mesh(lineGeometry, lineMaterial);
  scene.add(line);

  const sphereGeometry = new THREE.SphereGeometry(0.3, 64, 64);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0, 0.4, 0);
  scene.add(sphere);

  // 기본 조명 추가
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체 조명
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
};

// 카메라 설정
const setupCamera = () => {
  camera = new THREE.OrthographicCamera(
    (-cameraHeight * aspect) / 2, // left
    (cameraHeight * aspect) / 2, // right
    cameraHeight / 2, // top
    -cameraHeight / 2, // bottom
    0.1, // near
    1000 // far
  );
  camera.position.set(0, 0, 1); // 카메라 위치 (z값이 중요합니다. 객체가 near-far 안에 들어오도록)
  camera.updateProjectionMatrix(); // 프로젝션 매트릭스 업데이트
  scene.add(camera);
};

// 렌더러 설정
const setupRenderer = () => {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value!.clientWidth, container.value!.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  container.value!.appendChild(renderer.domElement);

  const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    samples: renderer.getPixelRatio() === 1 ? 2 : 0,
  });

  effectComposer = new EffectComposer(renderer, renderTarget);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effectComposer.setSize(container.value!.clientWidth, container.value!.clientHeight);

  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  const dotScreenPass = new DotScreenPass();
  dotScreenPass.enabled = false;
  effectComposer.addPass(dotScreenPass);

  const glitchPass = new GlitchPass();
  glitchPass.goWild = false;
  glitchPass.enabled = false;
  effectComposer.addPass(glitchPass);

  const rgbShiftPass = new ShaderPass(RGBShiftShader);
  rgbShiftPass.uniforms["amount"].value = 0.005;
  rgbShiftPass.enabled = false;
  effectComposer.addPass(rgbShiftPass);

  const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.3, 1, 0.6);
  unrealBloomPass.enabled = false;
  effectComposer.addPass(unrealBloomPass);

  const TintShader = {
    uniforms: {
      tDiffuse: { value: null },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse;

      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        color.r += 0.1;

        gl_FragColor = color;
      }
    `,
  };
  const tintPass = new ShaderPass(TintShader);
  effectComposer.addPass(tintPass);

  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
  effectComposer.addPass(gammaCorrectionPass);

  if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    effectComposer.addPass(smaaPass);
  }
};

const setupControls = () => {
  // OrbitControls 설정
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = true; // 카메라 조작 활성화
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 1;
  controls.maxDistance = 100;

  // TransformControls 설정
  transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  // transformControls.attach(line);
  // transformControls.setMode("rotate");

  scene.add(transformControls.getHelper());
};

// 애니메이션 루프
const animate = () => {
  requestAnimationFrame(animate);

  // 시간 업데이트
  planeMaterial.uniforms.uTime.value = performance.now() * 0.001;

  // OrbitControls 업데이트
  controls.update();

  effectComposer.render();
};

////////////////////////////////////////////////////////////////////////////////////////////////////

// 창 크기 변경 이벤트 리스너
const handleWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();

  effectComposer.setSize(window.innerWidth, window.innerHeight);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// 초기화 함수
const init = () => {
  setupScene();
  setupCamera();
  setupRenderer();
  setupControls();

  // DOM에 추가
  container.value?.appendChild(renderer.domElement);

  // 애니메이션 시작
  animate();

  // 창 크기 변경 이벤트 리스너 등록
  window.addEventListener("resize", handleWindowResize);
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
});
</script>

<template>
  <div ref="container" class="main-view"></div>
</template>

<style scoped>
.main-view {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
</style>
