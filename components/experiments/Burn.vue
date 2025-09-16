<script setup lang="ts">
import * as THREE from "three";

import ImagePlaneVertex from "./shaders/burn/ImagePlaneVertex.glsl";
import ImagePlaneFragment from "./shaders/burn/ImagePlaneFragment.glsl";

import ImageFireVertex from "./shaders/burn/ImageFireVertex.glsl";
import ImageFireFragment from "./shaders/burn/ImageFireFragment.glsl";

import ImagePointsVertex from "./shaders/burn/ImagePointsVertex.glsl";
import ImagePointsFrag from "./shaders/burn/ImagePointsFrag.glsl";

const burnRef = ref<HTMLElement | null>(null);
const timeTransition = ref(0);
const resolution = ref(new THREE.Vector2());
const imgIndexPrev = ref(0);
const imgIndexNext = ref(1);
const DURATION = 3;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;

let imagePlaneGeometry: THREE.PlaneGeometry;
let imagePlaneMaterial: THREE.ShaderMaterial;
let imagePlane: THREE.Mesh;

let imageFireGeometry: THREE.PlaneGeometry;
let imageFireMaterial: THREE.ShaderMaterial;
let imageFire: THREE.Mesh;

let imagePointsGeometry: THREE.BufferGeometry;
let imagePointsMaterial: THREE.ShaderMaterial;
let imagePoints: THREE.Points;

let clock = new THREE.Clock();
let imgTexes: Ref<THREE.Texture[]> = ref([]);
let imageGroup: THREE.Group = new THREE.Group();

const init = async () => {
  if (!burnRef.value) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 3 / 2, 0.1, 1000);
  camera.position.set(0, 0, 50);
  camera.lookAt(new THREE.Vector3());

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: burnRef.value });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x0e0e0e, 1.0);

  const textureLoader = new THREE.TextureLoader();

  await Promise.all([
    textureLoader.loadAsync("/images/experiments/burn/noise.png"),
    textureLoader.loadAsync("/images/experiments/burn/image01.jpg"),
    textureLoader.loadAsync("/images/experiments/burn/image02.jpg"),
    textureLoader.loadAsync("/images/experiments/burn/image03.jpg"),
  ]).then((response) => {
    const noiseTex = response[0];
    imgTexes.value = response.slice(1);

    noiseTex.wrapS = THREE.RepeatWrapping;
    noiseTex.wrapT = THREE.RepeatWrapping;

    imagePlane = setImagePlane(noiseTex);
    imagePoints = setImagePoints(noiseTex);
    imageFire = setImageFire(noiseTex);

    imageFire.renderOrder = 10;
    imagePoints.position.z = 5;

    imageGroup.add(imagePlane);
    imageGroup.add(imageFire);
    imageGroup.add(imagePoints);
    scene.add(imageGroup);
  });
};

const setImagePlane = (noiseTex: THREE.Texture) => {
  imagePlaneGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
  imagePlaneMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      easeTransition: { value: 0 },
      noiseTex: { value: noiseTex },
      imgPrevTex: { value: imgTexes.value[imgIndexPrev.value] },
      imgNextTex: { value: imgTexes.value[imgIndexNext.value] },
      imgRatio: { value: new THREE.Vector2() },
    },
    vertexShader: ImagePlaneVertex,
    fragmentShader: ImagePlaneFragment,
  });

  const mesh = new THREE.Mesh(imagePlaneGeometry, imagePlaneMaterial);
  mesh.name = "plane";

  return mesh;
};
const setImageFire = (noiseText: THREE.Texture) => {
  imageFireGeometry = new THREE.PlaneGeometry(1, 1, 128, 128);
  imageFireMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      easeTransition: { value: 0 },
      noiseTex: { value: noiseText },
      imgRatio: { value: new THREE.Vector2() },
    },
    vertexShader: ImageFireVertex,
    fragmentShader: ImageFireFragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Mesh(imageFireGeometry, imageFireMaterial);
  mesh.name = "fire";

  return mesh;
};
const setImagePoints = (noiseTex: THREE.Texture) => {
  const gaseGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  imagePointsGeometry = new THREE.BufferGeometry();
  imagePointsGeometry.setAttribute("position", gaseGeometry.attributes.position);
  imagePointsGeometry.setAttribute("uv", gaseGeometry.attributes.uv);

  imagePointsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      easeTransition: { value: 0 },
      noiseTex: { value: noiseTex },
      imgRatio: { value: new THREE.Vector2() },
      pixelRatio: { value: window.devicePixelRatio },
    },
    vertexShader: ImagePointsVertex,
    fragmentShader: ImagePointsFrag,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(imagePointsGeometry, imagePointsMaterial);
  points.name = "points";

  return points;
};

const changeTex = () => {
  imgIndexPrev.value = imgIndexNext.value;
  imgIndexNext.value = imgIndexNext.value + 1 >= imgTexes.value.length ? 0 : imgIndexNext.value + 1;
  imagePlaneMaterial.uniforms.imgPrevTex.value = imgTexes.value[imgIndexPrev.value];
  imagePlaneMaterial.uniforms.imgNextTex.value = imgTexes.value[imgIndexNext.value];
};

const resizeWindow = () => {
  resolution.value.set(document.body.clientWidth, window.innerHeight);
  renderer.setSize(resolution.value.x, resolution.value.y);
  camera.aspect = resolution.value.x / resolution.value.y;
  camera.updateProjectionMatrix();

  const radian = THREE.MathUtils.degToRad(camera.fov);
  const height = Math.abs((camera.position.z - imageGroup.position.z) * Math.tan(radian / 2) * 2);
  const width = height * camera.aspect;

  const margin = new THREE.Vector2();
  const size = new THREE.Vector3();

  margin.set(
    resolution.value.x > resolution.value.y ? resolution.value.y * 0.2 : resolution.value.x * 0.1,
    resolution.value.x > resolution.value.y ? resolution.value.y * 0.2 : resolution.value.y * 0.333
  );
  size.set(
    (width * (resolution.value.x - margin.x)) / resolution.value.x,
    (height * (resolution.value.y - margin.y)) / resolution.value.y,
    1
  );

  const imageRatio = new THREE.Vector2(Math.min(1, size.x / size.y), Math.min(1, size.y / size.x));

  imagePlaneMaterial.uniforms.imgRatio.value.set(imageRatio);
  imageFireMaterial.uniforms.imgRatio.value.set(imageRatio);
  imagePointsMaterial.uniforms.imgRatio.value.set(imageRatio);

  imagePlane.scale.copy(size);
  imageFire.scale.copy(size);
  imagePoints.scale.copy(size);
};

const animate = () => {
  requestAnimationFrame(animate);
  let time = clock.getDelta();
  timeTransition.value += time;

  const isEnd = timeTransition.value / DURATION >= 1;

  const easeStep = isEnd ? 0 : useEaseInOutQuad(Math.min(timeTransition.value / DURATION, 1.0));

  if (isEnd) {
    timeTransition.value = 0;
    changeTex();
    imagePlaneMaterial.uniforms.easeTransition.value = 0;
    imagePointsMaterial.uniforms.easeTransition.value = 0;
    imageFireMaterial.uniforms.easeTransition.value = 0;
  } else {
    imagePlaneMaterial.uniforms.easeTransition.value = easeStep;
    imagePointsMaterial.uniforms.easeTransition.value = easeStep;
    imageFireMaterial.uniforms.easeTransition.value = easeStep;
  }

  imagePlaneMaterial.uniforms.time.value += time;
  imagePointsMaterial.uniforms.time.value += time;
  imageFireMaterial.uniforms.time.value += time;

  renderer.render(scene, camera);
};

onMounted(() => {
  nextTick(async () => {
    await init();
    resizeWindow();
    animate();
  });
});
</script>

<template>
  <canvas ref="burnRef"></canvas>
</template>

<style scoped></style>
