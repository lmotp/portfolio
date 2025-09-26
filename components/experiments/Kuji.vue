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
  // setSVGMesh();

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

  const kujiGeometry = new THREE.PlaneGeometry(120, 80, 20, 20);
  const kujiMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load("/images/experiments/kuji/kuji_clip.png"),
    transparent: true,
    side: THREE.DoubleSide,
    // wireframe: true,
  });
  const kujiMesh = new THREE.Mesh(kujiGeometry, kujiMaterial);
  kujiMesh.position.z = 10;
  planeCurve(kujiGeometry, 10);
  scene.add(kujiMesh);

  transformControls.attach(kujiMesh);
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
    (svgGeometry as any).parameters.width = width;
    (svgGeometry as any).parameters.height = height;

    svgMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      opacity: 0.5,
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

    scene.add(svgMesh);
  });
};

const setLights = () => {
  dirLight = new THREE.DirectionalLight(0xffffff, 2.85);

  dirLight.castShadow = true;
  // ✨ 그림자 카메라의 범위와 해상도 조절 (매우 중요)
  dirLight.shadow.mapSize.width = window.innerWidth;
  dirLight.shadow.mapSize.height = window.innerHeight;

  dirLight.shadow.camera.left = -60;
  dirLight.shadow.camera.right = 60;
  dirLight.shadow.camera.top = 40;
  dirLight.shadow.camera.bottom = -40;

  dirLight.shadow.camera.near = 100;
  dirLight.shadow.camera.far = 200;

  dirLight.shadow.radius = 10;
  dirLight.shadow.bias = 0.005; // 약간의 바이어스 값으로 그림자 들뜸 방지 및 연하게 만들기
  dirLight.shadow.normalBias = 0.05; // 법선 바이어스 값으로 경사진 면의 그림자 부드럽게

  dirLight.position.set(0, 0, 150);

  scene.add(dirLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
  scene.add(hemiLight);
};

const resizeWindow = () => {
  resolution.value.set(window.innerWidth, window.innerHeight);

  camera.aspect = resolution.value.x / resolution.value.y;
  camera.updateProjectionMatrix();
  renderer.setSize(resolution.value.x, resolution.value.y);
};

const planeCurve = (g: THREE.ShapeGeometry | THREE.PlaneGeometry, z: number) => {
  let p = g.parameters;
  let hw = (p as any).width * 0.5;

  let a = new THREE.Vector2(-hw, 0);
  let b = new THREE.Vector2(0, z);
  let c = new THREE.Vector2(hw, 0);

  let ab = new THREE.Vector2().subVectors(a, b);
  let bc = new THREE.Vector2().subVectors(b, c);
  let ac = new THREE.Vector2().subVectors(a, c);

  let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));

  let center = new THREE.Vector2(0, z - r);
  let baseV = new THREE.Vector2().subVectors(a, center);
  let baseAngle = baseV.angle() - Math.PI * 0.5;
  let arc = baseAngle * 2;

  let uv = g.attributes.uv;
  let pos = g.attributes.position;

  let mainV = new THREE.Vector2();
  for (let i = 0; i < uv.count; i++) {
    let uvRatio = 1 - uv.getX(i);
    let y = pos.getY(i);
    mainV.copy(c).rotateAround(center, arc * uvRatio);
    pos.setXYZ(i, mainV.x, y, -mainV.y);
  }

  pos.needsUpdate = true;
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
