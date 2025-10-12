<script setup lang="ts">
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TransformControls } from "three/examples/jsm/Addons.js";

import kujiVertex from "~/shaders/kuji/kujiVertex.glsl";
import kujiFragment from "~/shaders/kuji/kujiFragment.glsl";

const kujiWrapRef = ref<HTMLElement | null>(null);
const kujiRef = ref<HTMLElement | null>(null);
const resolution = ref(new THREE.Vector2(window.innerWidth, window.innerHeight));

const buttonSetting = {
  xPos: 0,
  progress: 0,
};
const falterIntroRef = ref<HTMLElement | null>(null);
const topCircleRef = ref<HTMLElement | null>(null);
const connectingLineRef = ref<HTMLElement | null>(null);
const targetCircleRef = ref<HTMLElement | null>(null);
const yoyo = ref<gsap.core.Tween | gsap.core.Timeline | null>(null);
const isPress = ref(false);
const isEnd = ref(false);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

let dirLight: THREE.DirectionalLight;

let controls: OrbitControls;
let transformControls: TransformControls;

let geometry: THREE.PlaneGeometry;
let material: THREE.MeshStandardMaterial;
let mesh: THREE.Mesh;

let kujiGeometry: THREE.PlaneGeometry;
let kujiMaterial: THREE.MeshStandardMaterial;
let kujiMesh: THREE.Mesh;

let shadowGeometry: THREE.PlaneGeometry;
let shadowMaterial: THREE.ShaderMaterial;
let shadowMesh: THREE.Mesh;

let pivotGroup: THREE.Group;

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
  camera.position.set(-80, -25, 200);

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

  setLights();
  setPlaneMesh();
};

const setPlaneMesh = () => {
  const textureLoader = new THREE.TextureLoader();
  const totalGroup = new THREE.Group();

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

    totalGroup.add(mesh);
  });

  textureLoader.load("/images/experiments/kuji/kuji_clip.png", (tex) => {
    kujiGeometry = new THREE.PlaneGeometry(tex.image.width * 0.1, tex.image.height * 0.1, 20, 20);
    kujiMaterial = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
    });
    kujiMesh = new THREE.Mesh(kujiGeometry, kujiMaterial);
    kujiMesh.position.set(0.27715137759722996, 1.2027755882334343, 0.1);
    kujiMesh.castShadow = true;
    planeCurve(kujiGeometry, settings.value.curve);

    shadowGeometry = new THREE.PlaneGeometry(tex.image.width * 0.1, tex.image.height * 0.1, 20, 20);
    shadowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uTexture: { value: tex },
        imgRatio: { value: new THREE.Vector2() },
      },
      opacity: 0.5,
      transparent: true,
      vertexShader: kujiVertex,
      fragmentShader: kujiFragment,
    });
    shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowMesh.position.set(0.27715137759722996, 1.2027755882334343, 0);
    planeCurve(shadowGeometry, settings.value.curve);

    pivotGroup = new THREE.Group();
    pivotGroup.position.set(tex.image.width * 0.1 * 0.5, 0, 0.1);
    pivotGroup.add(kujiMesh);
    pivotGroup.add(shadowMesh);

    totalGroup.add(pivotGroup);
    scene.add(totalGroup);

    initAnimation();

    // gui.add(settings.value, "curve", 1, 100, 1).onChange((v: number) => {
    //   if (!isGrabbing.value) isGrabbing.value = true;
    // });
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

    pos.setXYZ(i, newX, y, newZ);
  }

  pos.needsUpdate = true;
};

const initAnimation = () => {
  yoyo.value = gsap.to(buttonSetting, {
    duration: 1, // 애니메이션 진행 시간 (1 -> 20)
    progress: 0.1, // 최종 목표 값
    ease: "power2.inOut",
    repeat: -1, // 🔁 -1은 무한 반복을 의미합니다.
    yoyo: true,
    onUpdate: () => {
      const progress = buttonSetting.progress;
      const curve = progress * 100;

      pivotGroup.rotation.y = THREE.MathUtils.degToRad(curve);
      planeCurve(kujiGeometry, curve);
      planeCurve(shadowGeometry, curve);
    },
  });
};
const buttonInit = () => {
  const topButton = topCircleRef.value;
  const pulsateCircle = topButton!.querySelector(".pulsate");
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1,
  });

  tl.to(pulsateCircle, {
    width: 150,
    height: 150,
    borderRadius: 200,
    ease: "expo.out",
    duration: 2,
    autoAlpha: 0,
    stagger: 0.2,
  });

  kujiWrapRef.value?.addEventListener("mousemove", (e) => {
    if (!isPress.value || isEnd.value) return;

    const o = e.clientX;
    const a =
      o - falterIntroRef.value!.getBoundingClientRect().left - topCircleRef.value!.getBoundingClientRect().width / 2;

    gsap.to(buttonSetting, {
      duration: 0.2,
      xPos: a,
      onUpdate: buttonUpdate,
    });

    e.preventDefault();
  });

  kujiWrapRef.value?.addEventListener("mouseup", () => {
    if (isPress.value) {
      isPress.value = false;

      if (buttonSetting.progress > 0.8) buttonComplete();
      else {
        yoyo.value?.resume();
        tl.play();
        gsap.to(topButton, {
          duration: 0.5,
          scale: 0.9,
          ease: "expo.out",
        });
        gsap.to(buttonSetting, {
          duration: 0.5,
          xPos: 0,
          ease: "expo.out",
          onUpdate: buttonUpdate,
        });
      }
    }
  });

  topButton?.addEventListener("mouseover", (e) => {
    if (isPress.value) return;
    gsap.to(topButton, { duration: 0.5, scale: 0.9 });
    e.preventDefault();
  });
  topButton?.addEventListener("mouseout", (e) => {
    if (isPress.value) return;
    gsap.to(topButton, {
      duration: 0.5,
      scale: 1,
    });
    tl.play();
    e.preventDefault();
  });
  topButton?.addEventListener("mousedown", (e) => {
    tl.pause();
    yoyo.value?.pause();
    gsap.to(tl, {
      duration: 0.2,
      progress: 0,
      ease: "expo.out",
    });
    gsap.to(topButton, {
      scale: 0.5,
      duration: 0.5,
      ease: "expo.out",
    });
    isPress.value = true;
    e.preventDefault();
  });
};
const connectingLineInit = () => {
  if (!connectingLineRef.value) return;

  const connectingLine = connectingLineRef.value;
  const width = connectingLine.clientWidth;
  const offset = 5;

  for (let i = 0; i < width; i++) {
    if (i % offset === 0) {
      const dot = document.createElement("span");
      dot.classList.add("small-dot");
      dot.style.cssText = `
      position: absolute;
      top:0;
      left:0;
      width: 1px;
      height: 1px;
      background-color: #000;
    `;
      connectingLine?.append(dot);
      gsap.set(dot, {
        x: i,
        autoAlpha: 0,
      });
    }
  }

  buttonMove(true);
};
const targetCircleInit = () => {
  if (!targetCircleRef?.value) return;

  const targetCircle = targetCircleRef.value;
  const width = targetCircle.clientWidth;
  const radius = width / 2;
  const angle = 360;
  const offset = 10;

  for (let i = 0; i < angle; i++) {
    if (i % offset === 0) {
      const dot = document.createElement("span");
      const dotAngle = (i * Math.PI) / 180;
      dot.classList.add("small-dot");
      dot.style.cssText = `
        position: absolute;
        top:50%;
        left:50%;
        width: 1px;
        height: 1px;
        background-color: #000;
      `;
      targetCircle?.append(dot);
      gsap.set(dot, {
        x: radius * Math.cos(dotAngle),
        y: radius * Math.sin(dotAngle),
      });
    }
  }
};

const buttonUpdate = () => {
  if (buttonSetting.progress > 1) {
    buttonSetting.progress = 1;
    buttonComplete();
  }
  if (buttonSetting.progress < 0) buttonSetting.progress = 0;
  if (buttonSetting.xPos < 0) buttonSetting.xPos = 0;

  const progress = buttonSetting.progress;
  const curve = progress * 100;

  pivotGroup.rotation.y = THREE.MathUtils.degToRad(curve);
  planeCurve(kujiGeometry, curve);
  planeCurve(shadowGeometry, curve);
  gsap.set(topCircleRef.value, { x: buttonSetting.xPos });
  buttonSetting.progress = buttonSetting.xPos / connectingLineRef.value!.clientWidth;
  buttonMove(false, buttonSetting.progress);
};
const buttonMove = (status: boolean, progress: number = 0) => {
  if (!connectingLineRef.value) return;
  const dots = connectingLineRef.value?.querySelectorAll(".small-dot");
  dots.forEach((dot, i) => {
    gsap.timeline().to(
      dot,
      {
        autoAlpha: i / dots.length < progress ? 0 : i / dots.length,
        ease: "expo.out",
      },
      status ? 0.01 * i : 0
    );
  });
};
const buttonComplete = () => {
  if (!isPress.value) {
    isPress.value = true;
    isEnd.value = true;

    gsap.to(falterIntroRef.value, {
      duration: 0.5,
      autoAlpha: 0,
      delay: 0.4,
      ease: "expo.out",
    });
    gsap.to(targetCircleRef.value, {
      duration: 0.5,
      scale: 1.3,
      autoAlpha: 0,
      delay: 0.1,
      ease: "expo.out",
    });
    gsap.to(buttonSetting, {
      duration: 0.5,
      xPos: connectingLineRef.value!.clientWidth + targetCircleRef.value!.clientWidth + 0.5,
      ease: "expo.out",
      onUpdate: buttonUpdate,
    });
  }
};

const animate = () => {
  requestAnimationFrame(animate);

  // controls.update();

  renderer.render(scene, camera);
};

onMounted(() => {
  init();
  animate();
  buttonInit();
  connectingLineInit();
  targetCircleInit();
  window.addEventListener("resize", resizeWindow);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>

<template>
  <div ref="kujiWrapRef" class="kuji-wrap">
    <canvas ref="kujiRef"></canvas>
    <div ref="falterIntroRef" class="falter-intro">
      <div ref="topCircleRef" class="top-circle">
        <div class="circle main"></div>
        <div class="pulsate circle"></div>
      </div>
      <div ref="connectingLineRef" class="connecting-line"></div>
      <div ref="targetCircleRef" class="target-circle"></div>
    </div>
  </div>
</template>

<style scoped>
.kuji-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .falter-intro {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    transform: translate(-50%, -50%);

    .top-circle {
      position: relative;
      width: 50px;
      height: 50px;
      cursor: pointer;

      .circle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid #000;
        transform: translate(-50%, -50%);
      }
    }

    .connecting-line {
      position: relative;
      width: 220px;
      height: 1px;
    }
    .target-circle {
      position: relative;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
</style>
