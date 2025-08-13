<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { useSpeedStore } from "@/stores/speed";

const speedStore = useSpeedStore();

const container = ref<HTMLDivElement | null>(null);
const LINE_COUNT = 100;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let dummy: THREE.Object3D;
let lines: any[] = [];
let instancedMesh: THREE.InstancedMesh;

const init = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.value?.appendChild(renderer.domElement);
  camera.position.z = 20;

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const vertices = new Float32Array([-0.55, 0, 0, 0.55, 0, 0, 0, 0.9, 0]);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.translate(0, 0.5, 0);

  instancedMesh = new THREE.InstancedMesh(geometry, material, LINE_COUNT);
  scene.add(instancedMesh);

  dummy = new THREE.Object3D();

  for (let i = 0; i < LINE_COUNT; i++) {
    const angle = (i / LINE_COUNT) * Math.PI * 2;
    const degree = (angle * 180) / Math.PI; // 라디안을 도로 변환
    const isTopBottom = (degree >= 60 && degree <= 120) || (degree >= 240 && degree <= 300);
    const radius = 45;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = 1;
    const position = new THREE.Vector3(x, y, z);
    const velocity = position.clone().negate().normalize();
    let scaleY = Math.random() * 10 + (isTopBottom ? 16 : 10);

    lines.push({
      position,
      velocity,
      scaleY,
      scaleSpeed: 0.5 + Math.random() * 0.25,
      initialScaleY: scaleY,
      isTopBottom,
    });

    dummy.position.copy(lines[i].position);
    dummy.rotation.z = Math.atan2(velocity.y, velocity.x) - Math.PI / 2;
    dummy.scale.set(1, lines[i].scaleY, 1);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
};

const animate = () => {
  requestAnimationFrame(animate);

  for (let i = 0; i < LINE_COUNT; i++) {
    const line = lines[i];
    const speedFactor = speedStore.currentSpeed; // 최대 속도 5를 기준으로 정규화
    const isEnabled = speedStore.isEnabled;

    if (!isEnabled && speedFactor >= 0.3) {
      line.scaleY -= line.scaleSpeed * speedFactor;
      if (line.scaleY <= 0) line.scaleY = line.initialScaleY;
    } else {
      line.initialScaleY = Math.random() * 10 + (line.isTopBottom ? 16 : 10);
      line.scaleY -= line.scaleSpeed;
    }

    dummy.position.copy(line.position);
    dummy.rotation.z = Math.atan2(line.velocity.y, line.velocity.x) - Math.PI / 2;
    dummy.scale.set(1, line.scaleY, 1);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;

  renderer.render(scene, camera);
};

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  renderer.dispose();
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
</style>
