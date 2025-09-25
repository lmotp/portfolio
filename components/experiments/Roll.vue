<script setup lang="ts">
import gsap from "gsap";
import * as THREE from "three";

import rollFragment from "~/shaders/roll/rollFragment.glsl";
import rollVertex from "~/shaders/roll/rollVertex.glsl";
import * as dat from "lil-gui";

const gui = new dat.GUI();
const settings = ref({
  angle: 0.15,
  rollOpen: () => {
    gsap.to(material.uniforms.progress, { duration: 1.7, value: 1, ease: "power2.inOut" });
  },
  rollClose: () => {
    gsap.to(material.uniforms.progress, { duration: 1.7, value: 0.1, ease: "power2.inOut" });
  },
});

const rollRef = ref<HTMLCanvasElement | null>(null);
const resolution = ref(new THREE.Vector2(window.innerWidth, window.innerHeight));
const clock = new THREE.Clock();

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

let geometry: THREE.PlaneGeometry;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;

const init = () => {
  if (!rollRef.value) return;

  renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, canvas: rollRef.value });
  renderer.setSize(resolution.value.x, resolution.value.y);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 1.0);

  camera = new THREE.PerspectiveCamera(70, resolution.value.x / resolution.value.y, 300, 1000);
  camera.position.set(0, 0, 400);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  new THREE.TextureLoader().load("/images/experiments/roll/texture.jpg", (tex) => {
    geometry = new THREE.PlaneGeometry(1, 1, 80, 80);
    material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0.2 },
        angle: { value: 0.15 },
        resolution: { value: new THREE.Vector4(tex.image.width, tex.image.height, 1, 1) },
        uTexture: { value: tex },
      },
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: rollVertex,
      fragmentShader: rollFragment,
    });

    console.log(material);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    gui.add(settings.value, "angle", 0, 1, 0.01);
    gui.add(settings.value, "rollOpen");
    gui.add(settings.value, "rollClose");

    gsap.to(material.uniforms.progress, { duration: 1.7, value: 1, ease: "power2.inOut" });

    resizeWindow();
  });
};

const animate = () => {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  if (material) {
    material.uniforms.time.value = time;
    material.uniforms.angle.value = settings.value.angle;
  }

  renderer.render(scene, camera);
};

const resizeWindow = () => {
  resolution.value.set(window.innerWidth, window.innerHeight);

  camera.aspect = resolution.value.x / resolution.value.y;
  camera.updateProjectionMatrix();
  renderer.setSize(resolution.value.x, resolution.value.y);

  const radian = THREE.MathUtils.degToRad(camera.fov);
  const height = Math.abs((camera.position.z - mesh.position.z) * Math.tan(radian / 2) * 2);
  const width = height * camera.aspect;

  const margin = new THREE.Vector2();
  const size = new THREE.Vector3();

  margin.set(
    resolution.value.x > resolution.value.y ? resolution.value.y * 0.5 : resolution.value.x * 0.1,
    resolution.value.x > resolution.value.y ? resolution.value.y * 0.5 : resolution.value.y * 0.333
  );

  size.set(
    (width * (resolution.value.x - margin.x)) / resolution.value.x,
    (height * (resolution.value.y - margin.y)) / resolution.value.y,
    1
  );

  mesh.scale.set(size.x, size.y, size.z);
};

onMounted(() => {
  nextTick(() => {
    init();
    animate();

    window.addEventListener("resize", resizeWindow);
  });
});

onUnmounted(() => {
  renderer.dispose();
  window.removeEventListener("resize", resizeWindow);
});
</script>

<template>
  <canvas ref="rollRef" />
</template>

<style scoped></style>
