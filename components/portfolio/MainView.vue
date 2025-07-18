<script setup lang="ts">
import Matter from "matter-js";

import * as THREE from "three";
import { PlaneShader } from "@/shaders/PlaneShader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/Addons.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

const scrollPercentage = ref(0);
const viewRef = ref<HTMLElement | null>(null);
const threeCanvas = ref<HTMLCanvasElement | null>(null);
const physicsCanvas = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let effectComposer: EffectComposer;
let planeMaterial: THREE.ShaderMaterial;

const barConfig = [
  { x: 200, y: 100, width: 700, height: 20, angle: 10.8 },
  { x: 500, y: 250, width: 700, height: 20, angle: -10.8 },
  { x: 340, y: 400, width: 700, height: 20, angle: 7.2 },
];

// 물리
const physicsInit = async () => {
  if (!physicsCanvas.value) return;

  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Composite = Matter.Composite;
  const Composites = Matter.Composites;
  const Common = Matter.Common;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Events = Matter.Events;

  // create an engine
  const engine = Engine.create();
  const engineWorld = engine.world;

  // create a renderer
  const render = Render.create({
    element: physicsCanvas.value,
    engine: engine,
    options: {
      width: physicsCanvas.value!.clientWidth,
      height: physicsCanvas.value!.clientHeight,
      wireframes: false,
      background: "transparent",
    },
  });

  // run the renderer
  Render.run(render);

  // create runner
  const runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  const stack = Composites.stack(20, 20, 20, 5, 0, 0, function (x: number, y: number) {
    return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
  });

  World.add(engineWorld, stack);

  const bars = barConfig.map((bar) => {
    const body = Bodies.rectangle(bar.x, bar.y, bar.width, bar.height, {
      isStatic: true,
      angle: useTransferDgreeToRadia(bar.angle),
    });
    return body;
  });

  World.add(engineWorld, bars);

  // fit the render viewport to the scene
  Render.lookAt(render, Composite.allBodies(engineWorld));

  // wrapping using matter-wrap plugin
  for (let i = 0; i < stack.bodies.length; i++) {
    stack.bodies[i].plugin.wrap = {
      min: { x: render.bounds.min.x, y: render.bounds.min.y },
      max: { x: render.bounds.max.x, y: render.bounds.max.y },
    };
  }

  render.canvas.style.visibility = "hidden";

  Events.on(engine, "afterUpdate", () => {
    planeMaterial.uniforms.uTexture.value = new THREE.CanvasTexture(render.canvas);
    planeMaterial.uniforms.uTexture.value.needsUpdate = true;
  });
};

const threeInit = () => {
  if (!threeCanvas.value) return;

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  camera.position.z = 1;

  // Plane
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xffffff) },
      uSpeed: { value: 0.5 },
      uScale: { value: 10.0 },
      uPercentage: { value: scrollPercentage.value },
      uTexture: { value: null },
    },
    vertexShader: PlaneShader.vertexShader,
    fragmentShader: PlaneShader.fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(threeCanvas.value.clientWidth, threeCanvas.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  threeCanvas.value.appendChild(renderer.domElement);

  const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    samples: renderer.getPixelRatio() === 1 ? 2 : 0,
  });

  effectComposer = new EffectComposer(renderer, renderTarget);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effectComposer.setSize(threeCanvas.value!.clientWidth, threeCanvas.value!.clientHeight);

  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  const glitchPass = new GlitchPass();
  glitchPass.goWild = false;
  effectComposer.addPass(glitchPass);

  // Add SMAA anti-aliasing pass
  if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    effectComposer.addPass(smaaPass);
  }

  // Animation
  animate();

  // Handle window resize
  window.addEventListener("resize", handleWindowResize);
};

const animate = () => {
  requestAnimationFrame(animate);

  // Update uniforms
  planeMaterial.uniforms.uPercentage.value = scrollPercentage.value;

  // Render effect composer
  effectComposer.render();
};

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = viewRef.value!;
  const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollPercentage.value = percentage;
};

const handleWindowResize = () => {
  if (!threeCanvas.value) return;

  camera.updateProjectionMatrix();
  renderer.setSize(threeCanvas.value.clientWidth, threeCanvas.value.clientHeight);
  effectComposer.setSize(threeCanvas.value.clientWidth, threeCanvas.value.clientHeight);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update SMAA pass if exists
  const smaaPass = effectComposer.passes.find((pass) => pass instanceof SMAAPass);
  if (smaaPass) {
    (smaaPass as SMAAPass).setSize(threeCanvas.value.clientWidth, threeCanvas.value.clientHeight);
  }
};

onMounted(() => {
  if (viewRef.value) viewRef.value.addEventListener("scroll", handleScroll);

  physicsInit();
  threeInit();
});

onUnmounted(() => {
  if (viewRef.value) viewRef.value.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleWindowResize);
});
</script>

<template>
  <div ref="viewRef" class="view" @scroll="handleScroll">
    <div ref="threeCanvas" class="main-bg"></div>
    <div ref="physicsCanvas" class="main-phy"></div>
  </div>
</template>

<style lang="scss" scoped>
.view {
  position: relative;
  width: 100%;
  height: 100%;
  isolation: isolate;

  .main-bg {
    position: absolute;
    inset: 0;
  }
  .main-phy {
    position: absolute;
    inset: 20px;
    z-index: -1;
  }
}
</style>
