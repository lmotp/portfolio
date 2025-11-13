<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import vertexShader from "@/shaders/about/vertex.glsl";
import fragmentShader from "@/shaders/about/fragment.glsl";

import usePublicAsset from "~/composables/usePublicAsset";

const aboutRef = ref<null | HTMLCanvasElement>(null);
const target = new THREE.Vector3();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
const gui = new dat.GUI();
const guiObject = {
  threshold: 1.0,
};

let geometry: THREE.PlaneGeometry;
let material: THREE.ShaderMaterial;
let mesh: THREE.Mesh;

let mouseGeometry: THREE.SphereGeometry;
let mouseMaterial: THREE.MeshBasicMaterial;
let mouseMesh: THREE.Mesh;

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;

let controls: OrbitControls;
let effectComposer: EffectComposer;
let lineArtPass: ShaderPass;

const LineArtShader = {
  uniforms: {
    tDiffuse: { value: null }, // 렌더링된 원본 텍스처
    resolution: { value: new THREE.Vector2() }, // 캔버스 해상도
    uThreshold: { value: 0.2 },
    uBlurRadius: { value: 1.0 },
  },

  vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,

  fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform float uThreshold;
        uniform vec2 resolution;
        varying vec2 vUv;

        // 픽셀을 흑백으로 변환하는 함수
        float toGrayscale(vec4 color) {
            return dot(color.rgb, vec3(0.299, 0.587, 0.114));
        }

        void main() {
            // 픽셀 간의 간격 (해상도에 따라 달라짐)
            vec2 texel = 1.0 / resolution;

            // 현재 픽셀의 흑백 값
            float center = toGrayscale( texture2D( tDiffuse, vUv ) );

            // 주변 8개 픽셀의 흑백 값 (Sobel/Laplacian 필터의 원리)
            float N = toGrayscale( texture2D( tDiffuse, vUv + vec2(0.0, texel.y) ) );
            float S = toGrayscale( texture2D( tDiffuse, vUv + vec2(0.0, -texel.y) ) );
            float E = toGrayscale( texture2D( tDiffuse, vUv + vec2(texel.x, 0.0) ) );
            float W = toGrayscale( texture2D( tDiffuse, vUv + vec2(-texel.x, 0.0) ) );
            float NW = toGrayscale( texture2D( tDiffuse, vUv + vec2(-texel.x, texel.y) ) );
            float NE = toGrayscale( texture2D( tDiffuse, vUv + vec2(texel.x, texel.y) ) );
            float SW = toGrayscale( texture2D( tDiffuse, vUv + vec2(-texel.x, -texel.y) ) );
            float SE = toGrayscale( texture2D( tDiffuse, vUv + vec2(texel.x, -texel.y) ) );

            // 주변 픽셀과의 색상(명도) 차이의 절대값 합산 (경계선 강도 계산)
            float delta = abs(center - N) + abs(center - S) + abs(center - E) + abs(center - W) +
                          abs(center - NW) + abs(center - NE) + abs(center - SW) + abs(center - SE);

            vec4 finalColor;

            if (delta > uThreshold) {
                finalColor = vec4(0.0, 0.0, 0.0, 1.0);
            } else {
                finalColor = vec4(1.0, 1.0, 1.0, 1.0);
            }

            gl_FragColor = finalColor;
        }
    `,
};

const init = () => {
  if (!aboutRef.value) return;

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(
    -canvasWidth / 2,
    canvasWidth / 2,
    canvasHeight / 2,
    -canvasHeight / 2,
    1,
    1000
  );
  camera.position.set(0, 0, 50);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(usePublicAsset("/images/contact/cover.jpg"), (texture) => {
    const imageWidth = texture.image.naturalWidth;
    const imageHeight = texture.image.naturalHeight;

    geometry = new THREE.PlaneGeometry(imageWidth, imageHeight, 32, 32);
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uNoise: { value: textureLoader.load(usePublicAsset("/images/contact/noise.jpg")) },
        uMouse: { value: mouse },
        uCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0.25 },
        uTextureResolution: { value: new THREE.Vector2(texture.image.naturalWidth, texture.image.naturalHeight) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader,
      fragmentShader,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const minPan = new THREE.Vector3((-imageWidth + canvasWidth) / 2, (-imageHeight + canvasHeight) / 2, -Infinity);
    const maxPan = new THREE.Vector3((imageWidth - canvasWidth) / 2, (imageHeight - canvasHeight) / 2, Infinity);

    controls.addEventListener("change", () => {
      target.copy(controls.target);
      controls.target.clamp(minPan, maxPan);
      target.sub(controls.target);
      camera.position.sub(target);
    });
  });

  // mouseGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  // mouseMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
  // scene.add(mouseMesh);

  renderer = new THREE.WebGLRenderer({
    canvas: aboutRef.value,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0x000000, 1);

  const renderTarget = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight, {
    samples: renderer.getPixelRatio() === 1 ? 2 : 0,
  });

  effectComposer = new EffectComposer(renderer, renderTarget);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effectComposer.setSize(canvasWidth, canvasHeight);

  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  const lineArtPass = new ShaderPass(LineArtShader);
  lineArtPass.uniforms["resolution"].value.set(canvasWidth, canvasHeight);
  effectComposer.addPass(lineArtPass);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  gui.add(guiObject, "threshold", 0, 1, 0.01);
};

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const animate = () => {
  requestAnimationFrame(animate);

  controls.update();

  effectComposer.render();
};

onMounted(() => {
  nextTick(() => {
    init();
    animate();
  });
});
</script>

<template>
  <div class="about" @mousemove="handleMouseMove">
    <canvas ref="aboutRef" />
  </div>
</template>

<style scoped>
.about {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
