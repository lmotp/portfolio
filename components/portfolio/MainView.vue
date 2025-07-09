<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PlaneShader } from "@/shaders/PlaneShader.js";
import uvChecker from "/images/checker.jpg";

const container = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let planeMaterial: THREE.ShaderMaterial;

// Scene 설정
const setupScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // ShaderMaterial 생성
  planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xffffff) },
      uTime: { value: 0.0 },
      uSpeed: { value: 0.5 },
      uScale: { value: 10.0 },
      uTexture: { value: new THREE.TextureLoader().load(uvChecker) },
    },
    vertexShader: PlaneShader.vertexShader,
    fragmentShader: PlaneShader.fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
  });

  // 화면 전체를 채우는 plane 생성
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  // 기본 조명 추가
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체 조명
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
};

// 카메라 설정
const setupCamera = () => {
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
  camera.position.set(0, 0, 1);
  camera.updateProjectionMatrix(); // 프로젝션 매트릭스 업데이트
  scene.add(camera);
};

// 렌더러 설정
const setupRenderer = () => {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value!.clientWidth, container.value!.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value!.appendChild(renderer.domElement);

  // OrbitControls 설정
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = true; // 카메라 조작 활성화
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 1;
  controls.maxDistance = 100;
};

// 창 크기 변경 이벤트 리스너
const handleWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
};

// 애니메이션 루프
const animate = () => {
  requestAnimationFrame(animate);

  // 시간 업데이트
  planeMaterial.uniforms.uTime.value = performance.now() * 0.001;

  // OrbitControls 업데이트
  controls.update();

  renderer.render(scene, camera);
};

// 초기화 함수
const init = () => {
  setupScene();
  setupCamera();
  setupRenderer();

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
