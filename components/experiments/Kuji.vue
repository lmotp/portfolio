<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import ImageVertex from "~/shaders/kuji/imageVertex.glsl";
import ImageFragment from "~/shaders/kuji/imageFragment.glsl";

import KujiVertex from "~/shaders/kuji/kujiVertex.glsl";
import KujiFragment from "~/shaders/kuji/kujiFragment.glsl";

const kujiRef = ref<HTMLElement | null>(null);
const resolution = ref(new THREE.Vector2(window.innerWidth, window.innerHeight));

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;

let geometry: THREE.PlaneGeometry;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;

const gui = new dat.GUI();
const settings = ref({
  scale: 0.1,
});

const init = () => {
  if (!kujiRef.value) return;

  renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, canvas: kujiRef.value });
  renderer.setSize(resolution.value.x, resolution.value.y);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x0e0e0e, 1.0);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, resolution.value.x / resolution.value.y, 0.1, 1000);
  camera.position.set(0, 0, 150);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  setPlaneMesh();
  setSVGMesh();
};

const setPlaneMesh = () => {
  const textureLoader = new THREE.TextureLoader();
  const imageTex = textureLoader.load("/images/experiments/kuji/kuji_front.jpg");

  geometry = new THREE.PlaneGeometry(120, 80);
  material = new THREE.ShaderMaterial({
    uniforms: {
      imgRatio: { value: new THREE.Vector2() },
      uTexture: { value: imageTex },
    },
    vertexShader: ImageVertex,
    fragmentShader: ImageFragment,
    side: THREE.DoubleSide,
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};

const setSVGMesh = () => {
  const svgLoader = new SVGLoader();
  svgLoader.load("/images/experiments/kuji/kuji_point.svg", (data) => {
    const path = data.paths[0];
    const shapes = SVGLoader.createShapes(path);
    const scaleSize = 0.09;

    const geometry = new THREE.ShapeGeometry(shapes[0]);
    const positions = geometry.attributes.position.array;
    const uvs = new Float32Array((positions.length * 2) / 3);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let k = 0; k < positions.length; k += 3) {
      minX = Math.min(minX, positions[k]);
      maxX = Math.max(maxX, positions[k]);
      minY = Math.min(minY, positions[k + 1]);
      maxY = Math.max(maxY, positions[k + 1]);
    }

    const width = maxX - minX;
    const height = maxY - minY;

    for (let k = 0; k < positions.length; k += 3) {
      const x = positions[k];
      const y = positions[k + 1];
      uvs[(k / 3) * 2] = (x - minX) / width;
      uvs[(k / 3) * 2 + 1] = (y - minY) / height;
    }

    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
      },
      vertexShader: KujiVertex,
      fragmentShader: KujiFragment,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.scale.y *= -1;
    mesh.scale.set(scaleSize, scaleSize, scaleSize);

    scene.add(mesh);

    const bbox = new THREE.Box3().setFromObject(mesh);
    const center = bbox.getCenter(new THREE.Vector3());

    mesh.position.x -= center.x;
    mesh.position.y -= center.y;
    mesh.position.z = 0.1;
  });
};

const resizeWindow = () => {
  resolution.value.set(window.innerWidth, window.innerHeight);

  camera.aspect = resolution.value.x / resolution.value.y;
  camera.updateProjectionMatrix();
  renderer.setSize(resolution.value.x, resolution.value.y);
};

const animate = () => {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

onMounted(() => {
  init();
  animate();
  window.addEventListener("resize", resizeWindow);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>

<template>
  <canvas ref="kujiRef"></canvas>
</template>

<style scoped></style>
