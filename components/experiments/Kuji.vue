<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TransformControls } from "three/examples/jsm/Addons.js";

const kujiRef = ref<HTMLElement | null>(null);
const resolution = ref(new THREE.Vector2(window.innerWidth, window.innerHeight));

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

let ambientLight: THREE.AmbientLight;
let dirLight: THREE.DirectionalLight;

let controls: OrbitControls;
let transformControls: TransformControls;

let geometry: THREE.PlaneGeometry;
let material: THREE.MeshStandardMaterial;
let mesh: THREE.Mesh;

let svgGeometry: THREE.ShapeGeometry;
let svgMaterial: THREE.MeshStandardMaterial;
let svgMesh: THREE.Mesh;

const gui = new dat.GUI();
const settings = ref({
  scale: 0.0085,
  intensity: 1.5,
});

const init = () => {
  if (!kujiRef.value) return;

  renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, canvas: kujiRef.value });
  renderer.setSize(resolution.value.x, resolution.value.y);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 1.0);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, resolution.value.x / resolution.value.y, 0.1, 1000);
  camera.position.set(0, 0, 150);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });
  transformControls.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });

  const gizmo = transformControls.getHelper();
  scene.add(gizmo);

  setPlaneMesh();
  setSVGMesh();

  setLights();
};

const setPlaneMesh = () => {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/images/experiments/kuji/kuji_front.jpg", (tex) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    geometry = new THREE.PlaneGeometry(120, 80);
    material = new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.DoubleSide,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    scene.add(mesh);
  });
};

const setSVGMesh = () => {
  const svgLoader = new SVGLoader();
  svgLoader.load("/images/experiments/kuji/kuji_point.svg", (data) => {
    const path = data.paths[0];
    const shapes = SVGLoader.createShapes(path);
    const scaleSize = 0.086;

    svgGeometry = new THREE.ShapeGeometry(shapes[0]);
    const positions = svgGeometry.attributes.position.array;
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

    svgGeometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    svgMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,

      // opacity: 0.5,
      // transparent: true,
    });
    svgMesh = new THREE.Mesh(svgGeometry, svgMaterial);
    svgMesh.castShadow = true;
    svgMesh.scale.y *= -1;
    svgMesh.scale.set(scaleSize, scaleSize, scaleSize);

    const bbox = new THREE.Box3().setFromObject(svgMesh);
    const center = bbox.getCenter(new THREE.Vector3());

    svgMesh.position.x -= center.x - 0.5;
    svgMesh.position.y -= center.y - 0.5;
    svgMesh.position.z = 0.1;

    svgMesh.rotateY(THREE.MathUtils.degToRad(-30));

    scene.add(svgMesh);
  });
};

const setLights = () => {
  dirLight = new THREE.DirectionalLight(0xffffff, 3.15);

  dirLight.castShadow = true;
  // ✨ 그림자 카메라의 범위와 해상도 조절 (매우 중요)
  dirLight.shadow.mapSize.width = 2048; // 해상도 높이기
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.left = -60;
  dirLight.shadow.camera.right = 60;
  dirLight.shadow.camera.top = 40;
  dirLight.shadow.camera.bottom = -40;
  dirLight.shadow.camera.near = 100;
  dirLight.shadow.camera.far = 200;

  dirLight.position.set(0, 0, 150);
  scene.add(dirLight);

  // const rectLight = new THREE.RectAreaLight(0xffffff, 1, 1, 1);
  // rectLight.position.set(0, 0, 150);
  // scene.add(rectLight);

  // const pointLight = new THREE.PointLight(0x0000ff, 1);
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  // pointLight.position.set(0, 0, 10);
  // scene.add(pointLight);
  // scene.add(pointLightHelper);

  // transformControls.attach(pointLight);
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
