<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import moebiusFragment from "@/shaders/processing/moebius/moebiusFragment.glsl";
import moebiusVertex from "@/shaders/processing/moebius/moebiusVertex.glsl";

import customNormalFragment from "@/shaders/processing/moebius/customNormalFragment.glsl";
import customNormalVertex from "@/shaders/processing/moebius/customNormalVertex.glsl";

import groundNormalVertex from "@/shaders/processing/moebius/groundNormalVertex.glsl";

const MoebiusRef = ref<HTMLCanvasElement | null>(null);
const lightPosition = new THREE.Vector3(-50, 50, 15);

let renderer: THREE.WebGLRenderer;
let depthTexture: THREE.DepthTexture;
let depthRenderTarget: THREE.WebGLRenderTarget;
let normalRenderTarget: THREE.WebGLRenderTarget;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let light: THREE.DirectionalLight;

let ground: THREE.Mesh;
let groundMaterial: THREE.MeshStandardMaterial;
let customNormalMaterial: THREE.ShaderMaterial;
let groundNormalMaterial: THREE.ShaderMaterial;
let modelGroup: THREE.Group;

let composer: EffectComposer;

const clock = new THREE.Clock();
// const gui = new dat.GUI();

const init = () => {
  if (!MoebiusRef.value) return;

  renderer = new THREE.WebGLRenderer({ canvas: MoebiusRef.value });
  renderer.setClearColor("#050505");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);
  depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  depthRenderTarget.depthBuffer = true;
  depthRenderTarget.depthTexture = depthTexture;

  normalRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  customNormalMaterial = new THREE.ShaderMaterial({
    uniforms: { lightPosition: { value: lightPosition } },
    vertexShader: customNormalVertex,
    fragmentShader: customNormalFragment,
  });
  groundNormalMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      lightPosition: { value: lightPosition },
    },
    vertexShader: groundNormalVertex,
    fragmentShader: customNormalFragment,
  });

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 800);
  camera.position.set(-8, 4, -20);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene = new THREE.Scene();

  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;

  setupMesh();
  setupGround();
  setupModel();
  setupLight();
  setupPass();

  animate();
};

const setupMesh = () => {
  const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);

  const sphereMaterial1 = new THREE.MeshStandardMaterial({ color: "darkorange" });
  const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
  sphere1.position.set(80, 50, 140);
  sphere1.scale.set(10, 10, 10);

  const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: "cyan" });
  const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
  sphere2.position.set(50, 55, 120);
  sphere2.scale.set(3, 3, 3);

  scene.add(sphere1);
  scene.add(sphere2);
};
const setupGround = () => {
  const groundGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
  groundMaterial = new THREE.MeshStandardMaterial({ color: "#FF6457" });
  groundMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader =
      `uniform float uTime;
      vec4 permute(vec4 x) {
        return mod(((x*34.0)+1.0)*x, 289.0);
      }

      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      vec3 fade(vec3 t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
      }

      float cnoise(vec3 P) {
        vec3 Pi0 = floor(P); // Integer part for indexing
        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
        return 2.2 * n_xyz;
      }

      vec3 orthogonal(vec3 v) {
        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        : vec3(0.0, -v.z, v.y));
      }


      float displace(vec3 point) {
        return cnoise(point * 0.05 - vec3(0.0, uTime * 2.5, 0.0)) * 2.5;
      }
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <clipping_planes_vertex>",
      `#include <clipping_planes_vertex>


        vec3 displacedPosition = position + normal * displace(position);
        vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        float offset = 0.01;
        vec3 tangent = orthogonal(normal);
        vec3 bitangent = normalize(cross(normal, tangent));
        vec3 neighbour1 = position + tangent * offset;
        vec3 neighbour2 = position + bitangent * offset;
        vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
        vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);

        vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
        vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

        // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
        vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
        vNormal = displacedNormal;`
    );

    groundMaterial.userData.shader = shader;
  };

  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.name = "ground";
  ground.receiveShadow = true;
  ground.castShadow = true;
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;

  scene.add(ground);
};
const setupModel = async () => {
  const containerGroup = new THREE.Group();
  containerGroup.rotation.set(0, Math.PI / 2, 0);
  containerGroup.position.set(0, 2, 0);

  const innerGroup = new THREE.Group();
  innerGroup.scale.set(0.005, 0.005, 0.005);
  innerGroup.rotation.set(0, -Math.PI * 0.5, 0);
  innerGroup.position.set(1.583, 0, -3.725);

  modelGroup = new THREE.Group();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(usePublicAsset("/models/spaceship-optimized.glb"), async (gltf) => {
    const model = gltf.scene;
    model.children.forEach((child: any) => {
      child.receiveShadow = true;
      child.castShadow = true;
      child.scale.set(1, 1, 1);

      if (child.name === "Cube001_spaceship_racer_0") child.position.set(739.26, -64.81, 64.77);
      else child.position.set(739.26, 0, 0);

      setModelConfig(child.material);
    });

    await renderer.compileAsync(model, camera, scene);

    innerGroup.add(model);
    modelGroup.add(innerGroup);
    containerGroup.add(modelGroup);
    scene.add(containerGroup);
  });
};
const setModelConfig = (material: THREE.Material) => {
  material.transparent = true;
  material.alphaToCoverage = true;
  material.depthFunc = THREE.LessEqualDepth;
  material.depthTest = true;
  material.depthWrite = true;
};

const setupLight = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  light = new THREE.DirectionalLight(0xffffff, 5);
  light.castShadow = true;
  light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
  light.target = ground;

  scene.add(ambientLight);
  scene.add(light);
};

const setupPass = () => {
  composer = new EffectComposer(renderer);
  const dpi = Math.min(window.devicePixelRatio, 2);
  const renderPass = new RenderPass(scene, camera);
  const moebiusPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      tNormal: { value: null },
      cameraNear: { value: 0 },
      cameraFar: { value: 0 },
      resolution: { value: new THREE.Vector2() },
    },
    fragmentShader: moebiusFragment,
    vertexShader: moebiusVertex,
  });

  moebiusPass.uniforms.cameraNear.value = camera.near;
  moebiusPass.uniforms.cameraFar.value = camera.far;
  moebiusPass.uniforms.tDepth.value = depthRenderTarget.depthTexture;
  moebiusPass.uniforms.tNormal.value = normalRenderTarget.texture;
  moebiusPass.uniforms.resolution.value.set(window.innerWidth * dpi, window.innerHeight * dpi);

  composer.addPass(renderPass);
  composer.addPass(moebiusPass);
};

const animate = () => {
  requestAnimationFrame(animate);

  renderer.setRenderTarget(depthRenderTarget);
  renderer.render(scene, camera);

  const materials: THREE.Material[] = [];

  renderer.setRenderTarget(normalRenderTarget);

  scene.traverse((obj: any) => {
    if (obj.isMesh) {
      materials.push(obj.material);

      if (obj.name === "ground") {
        groundMaterial.userData.shader.uniforms.uTime.value = clock.getElapsedTime();
        obj.material = groundNormalMaterial;
        obj.material.uniforms.uTime.value = clock.getElapsedTime();
        obj.material.uniforms.lightPosition.value = lightPosition;
      } else {
        obj.material = customNormalMaterial;
        obj.material.uniforms.lightPosition.value = lightPosition;
      }
    }
  });

  renderer.render(scene, camera);

  scene.traverse((obj: any) => {
    if (obj.isMesh) obj.material = materials.shift();
  });

  renderer.setRenderTarget(null);

  composer.render();

  if (modelGroup) {
    modelGroup.rotation.x = Math.cos(clock.getElapsedTime() * 2.0) * Math.cos(clock.getElapsedTime()) * 0.15;
    modelGroup.position.y = Math.sin(clock.getElapsedTime() * 2.0) + 1;
  }
};

onMounted(() => {
  init();
});
</script>

<template>
  <canvas ref="MoebiusRef"></canvas>
</template>

<style scoped></style>
