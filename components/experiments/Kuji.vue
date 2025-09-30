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

let kujiGeometry: THREE.PlaneGeometry;
let kujiMaterial: THREE.MeshStandardMaterial;
let kujiMesh: THREE.Mesh;

const gui = new dat.GUI();
const settings = ref({
  scale: 0.0085,
  intensity: 1.5,
  curve: 1,
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
  camera = new THREE.PerspectiveCamera(50, resolution.value.x / resolution.value.y, 0.1, 2000);
  camera.position.set(0, 0, 150);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.addEventListener("change", () => {
    renderer.render(scene, camera);

    if (kujiMesh) {
      const rotation = kujiMesh.rotation;
      console.log(rotation);
    }
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
    geometry = new THREE.PlaneGeometry(tex.image.width * 0.1, tex.image.height * 0.1);
    material = new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.DoubleSide,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    scene.add(mesh);
  });

  textureLoader.load("/images/experiments/kuji/kuji_clip.png", (tex) => {
    kujiGeometry = new THREE.PlaneGeometry(tex.image.width * 0.1, tex.image.height * 0.1, 20, 20);
    kujiMaterial = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
    });
    kujiMesh = new THREE.Mesh(kujiGeometry, kujiMaterial);
    kujiMesh.position.set(0.27715137759722996 - tex.image.width * 0.1 * 0.5, 1.2027755882334343, 0.5);
    planeCurve(kujiGeometry, settings.value.curve);

    const pivotGroup = new THREE.Group();
    pivotGroup.position.set(tex.image.width * 0.1 * 0.5, 1.2027755882334343, 0.5);
    pivotGroup.add(kujiMesh);
    scene.add(pivotGroup);

    gui.add(settings.value, "curve", 1, 100, 1).onChange((v: number) => {
      pivotGroup.rotation.y = THREE.MathUtils.degToRad(v);
      planeCurve(kujiGeometry, v);
    });
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
  dirLight = new THREE.DirectionalLight(0xffffff, 2);

  dirLight.castShadow = true;
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
  const params = g.parameters as any;
  const hw = params.width;
  const r = (z * z + hw * hw) / (2 * Math.abs(z));

  const center = new THREE.Vector3(0, 0, r);

  const fixPoint = new THREE.Vector3(-hw, 0, 0);
  const baseV = new THREE.Vector3().subVectors(fixPoint, center);
  const baseAngle = Math.atan2(baseV.z, baseV.x);
  const arc = Math.atan2(hw, Math.abs(r));

  const pos = g.attributes.position;
  const uv = g.attributes.uv;

  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i);
    const y = pos.getY(i);

    const currentAngle = baseAngle + arc * u;

    const newX = center.x + r * Math.cos(currentAngle);
    const newZ = center.z + r * Math.sin(currentAngle);

    pos.setXYZ(i, newX + hw * 0.5, y, newZ);
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
