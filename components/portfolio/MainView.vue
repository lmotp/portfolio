<script setup lang="ts">
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const container = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let flower: THREE.Group | null = null;
let controls: OrbitControls;

// Scene 설정
const setupScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // 바닥 plane 생성
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.name = "plane";
  scene.add(plane);

  // 바닥 plane의 텍스처 설정
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/textures/grid.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    const plane = scene.getObjectByName("plane");
    if (plane && plane instanceof THREE.Mesh) {
      plane.material.map = texture;
      plane.material.needsUpdate = true;
    }
  });

  // 기본 조명 추가
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체 조명
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
};

// 카메라 설정
const setupCamera = () => {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 2;
};

// 렌더러 설정
const setupRenderer = () => {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value!.clientWidth, container.value!.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value!.appendChild(renderer.domElement);

  // OrbitControls 설정
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 1;
  controls.maxDistance = 100;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
};

// 모델 로드
const loadModel = async () => {
  const loader = new GLTFLoader();
  loader.load(
    "/models/flower.glb",
    (gltf) => {
      flower = gltf.scene;

      // base 제거
      const baseMesh = flower.getObjectByName("base");
      baseMesh.parent.remove(baseMesh);

      const tigeMesh = flower.getObjectByName("tige");
      const tigeBox = new THREE.Box3().setFromObject(tigeMesh);
      const tigeBottom = tigeBox.min.y;

      const flowerMesh = flower.getObjectByName("flower");
      const flowerBox = new THREE.Box3().setFromObject(flowerMesh);
      const flowerBottom = flowerBox.min.y;
      const flowerTop = flowerBox.max.y;
      const flowerHeight = flowerTop - flowerBottom;

      flowerMesh.position.set(0, tigeBottom + flowerHeight / 2 + 0.1, 0);

      // 모델의 위치와 크기 조정
      flower.position.set(0, 0, 0);
      flower.scale.set(2, 2, 2); // 크기 조정

      scene.add(flower);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error("An error happened", error);
    }
  );
};

// 창 크기 변경 이벤트 리스너
const handleWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 애니메이션 루프
const animate = () => {
  requestAnimationFrame(animate);

  // OrbitControls 업데이트
  controls.update();

  // 조명 위치 업데이트
  if (flower) {
    const directionalLight = scene.getObjectByName("directionalLight") as THREE.DirectionalLight;
    if (directionalLight) {
      directionalLight.position.set(Math.sin(Date.now() * 0.001) * 5, 5, Math.cos(Date.now() * 0.001) * 5);
    }
  }

  renderer.render(scene, camera);
};

// 초기화 함수
const init = () => {
  setupScene();
  setupCamera();
  setupRenderer();
  loadModel();

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
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
</style>
