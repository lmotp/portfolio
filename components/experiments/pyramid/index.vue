<script setup lang="ts">
import * as THREE from "three";
import gsap from "gsap";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

import tableData from "./data";

const pyramidRef = ref<HTMLCanvasElement | null>(null);
const elementRef = ref<HTMLDivElement[]>([]);
const objects = ref<CSS3DObject[]>([]);
const targets = ref({ table: <any>[], pyramid: <any>[] });
const axis = new THREE.Vector3(0, 1, 0);
const lookAt = new THREE.Vector3();
const localLookAt = new THREE.Vector3();
const type = ref<"table" | "pyramid">("table");
const interval = ref<NodeJS.Timeout | null>(null);

let renderer: CSS3DRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: TrackballControls;

const init = () => {
  if (!pyramidRef.value) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;

  renderer = new CSS3DRenderer();
  renderer.setSize(width, height);
  pyramidRef.value?.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(40, aspect, 1, 10000);
  camera.position.z = 3000;

  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", () => renderer.render(scene, camera));

  scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  setupPositionInitialize();
  setupTables();
  setupPyramids();

  transform(targets.value.table, 2);

  interval.value = setInterval(() => {
    type.value = type.value === "table" ? "pyramid" : "table";
    transform(targets.value[type.value], 2);
  }, 6000);

  animate();
};

const setupPositionInitialize = () => {
  elementRef.value.forEach((element, index) => {
    const objectCSS = new CSS3DObject(element);
    objectCSS.position.x = Math.random() * 4000 - 2000;
    objectCSS.position.y = Math.random() * 4000 - 2000;
    objectCSS.position.z = Math.random() * 4000 - 2000;
    scene.add(objectCSS);

    objects.value.push(objectCSS);
  });
};

const setupTables = () => {
  elementRef.value.forEach((_, index) => {
    const object = new THREE.Object3D();
    object.position.x = tableData[index].group * 140 - 1330;
    object.position.y = -tableData[index].period * 180 + 990;

    targets.value.table.push(object);
  });
};

const setupPyramids = () => {
  const itemH = 180;
  const itemW = 140;
  const startH = itemH * 2;

  for (let sides = 0; sides < 4; sides++) {
    let angle = Math.PI * 0.5 * sides;
    let firstItem = 1;

    lookAt.set(0, 1, 1).normalize().applyAxisAngle(axis, angle);

    for (let rows = 0; rows < 5; rows++) {
      let items = firstItem + rows * 2; // arithmetic progression

      let h = startH - rows * itemH;
      let w = -((items - 1) / 2) * itemW;

      for (let item = 0; item < items; item++) {
        let object = new THREE.Object3D();
        object.position.set(w + item * itemW, h, (rows + 1) * itemW);
        object.position.applyAxisAngle(axis, angle);
        object.lookAt(localLookAt.addVectors(object.position, lookAt));
        targets.value.pyramid.push(object);
      }
    }
  }

  lookAt.set(0, -1, 0);

  const step = (itemW * 9) / 5;

  for (let i = 0; i < 18; i++) {
    let object = new THREE.Object3D();
    let x0 = -itemW * 4;
    let z0 = -itemW * 4;
    let row = Math.floor(i / 5);
    let col = i - row * 5;
    object.position.set(x0 + col * step, -itemH * 3, z0 + row * step * 1.25);
    object.lookAt(localLookAt.addVectors(object.position, lookAt));
    targets.value.pyramid.push(object);
  }
};

const transform = (targets: any[], duration: number) => {
  for (let i = 0; i < objects.value.length; i++) {
    const object = objects.value[i];
    const target = targets[i];
    const randomDuration = Math.random() * duration + duration;

    gsap.to(object.position, {
      duration: randomDuration,
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      ease: "power3.inOut",
    });

    gsap.to(object.rotation, {
      duration: randomDuration,
      x: target.rotation.x,
      y: target.rotation.y,
      z: target.rotation.z,
      ease: "power3.inOut",
    });
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

onMounted(() => {
  nextTick(init);
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});
</script>

<template>
  <div id="container" ref="pyramidRef">
    <template v-for="data in tableData" :key="data.symbol">
      <div
        ref="elementRef"
        class="element"
        :style="{ backgroundColor: `rgba(0,127,127,${Math.random() * 0.5 + 0.25})` }"
      >
        <div class="number">{{ data.mass }}</div>
        <div class="symbol">{{ data.symbol }}</div>
        <div class="details">
          {{ data.name }}<br />
          {{ data.mass }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
#container {
  background-color: black;

  .element {
    width: 120px;
    height: 160px;
    box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
    border: 1px solid rgba(127, 255, 255, 0.25);
    font-family: Helvetica, sans-serif;
    text-align: center;
    line-height: normal;
    cursor: default;
  }

  .element:hover {
    box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
    border: 1px solid rgba(127, 255, 255, 0.75);
  }

  .element .number {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(127, 255, 255, 0.75);
  }

  .element .symbol {
    position: absolute;
    top: 40px;
    left: 0px;
    right: 0px;
    font-size: 60px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
  }

  .element .details {
    position: absolute;
    bottom: 15px;
    left: 0px;
    right: 0px;
    font-size: 12px;
    color: rgba(127, 255, 255, 0.75);
  }

  button {
    color: rgba(127, 255, 255, 0.75);
    background: transparent;
    outline: 1px solid rgba(127, 255, 255, 0.75);
    border: 0px;
    padding: 5px 10px;
    cursor: pointer;
  }

  button:hover {
    background-color: rgba(0, 255, 255, 0.5);
  }

  button:active {
    color: #000000;
    background-color: rgba(0, 255, 255, 0.75);
  }
}
</style>
