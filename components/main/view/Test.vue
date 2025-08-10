<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { ref, onMounted, onUnmounted } from "vue";

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
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value?.appendChild(renderer.domElement);
  camera.position.z = 20;

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const vertices = new Float32Array([-0.65, 0, 0, 0.65, 0, 0, 0, 1, 0]);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.translate(0, 0.5, 0);

  instancedMesh = new THREE.InstancedMesh(geometry, material, LINE_COUNT);
  scene.add(instancedMesh);

  dummy = new THREE.Object3D();

  for (let i = 0; i < LINE_COUNT; i++) {
    const angle = (i / LINE_COUNT) * Math.PI * 2;
    const radius = 40;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = 1;
    const position = new THREE.Vector3(x, y, z);
    const velocity = position.clone().negate().normalize();
    const scaleY = Math.random() * 10 + 10;

    lines.push({
      position,
      velocity,
      scaleY,
      scaleSpeed: 0.05 + Math.random() * 0.05,
      initialScaleY: scaleY,
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

    line.scaleY -= line.scaleSpeed;
    if (line.scaleY < 0) line.scaleY = line.initialScaleY;

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

<style scoped></style>
