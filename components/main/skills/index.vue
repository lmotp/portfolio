<script setup lang="ts">
import * as THREE from "three";
import skillsVertex from "~/shaders/skills/skillsVertex.glsl";
import skillsFragment from "~/shaders/skills/skillsFragment.glsl";

import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

const scrollTriggerStore = useScrollTriggerStore();
const { isOutroEnd, scrollY } = storeToRefs(scrollTriggerStore);

const skillsRef = ref<HTMLCanvasElement | null>(null);
const skillWrapRef = ref<HTMLDivElement | null>(null);
const mediaRefs = ref<{ el: any; mesh: THREE.Mesh; initY: number }[]>([]);

const viewport = ref({
  width: 0,
  height: 0,
});

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

const init = () => {
  if (!skillsRef.value || !skillWrapRef.value) return;

  const group = new THREE.Group();
  const images = skillWrapRef.value.querySelectorAll(".media");
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  renderer = new THREE.WebGLRenderer({
    canvas: skillsRef.value,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size.width, size.height);
  renderer.setClearColor(0x000000, 0);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
  camera.position.set(0, 0, 20);

  images.forEach((el) => {
    const image = el.querySelector("img");
    const initY = el.getBoundingClientRect().top;
    const mesh = setImageMesh(el, image) as any;

    mediaRefs.value.push({ el, mesh, initY });
    group.add(mesh);
  });

  scene.add(group);
};
const setImageMesh = (el: any, image: HTMLImageElement | null) => {
  if (!image) return;

  const texture = new THREE.Texture();
  texture.generateMipmaps = false;

  const fov = camera.fov * (Math.PI / 180);
  const height = 2 * Math.tan(fov / 2) * camera.position.z;
  const width = height * camera.aspect;
  viewport.value = { width, height };

  const geometry = new THREE.PlaneGeometry(1, 1, 50, 100);
  const material = new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    uniforms: {
      tMap: { value: texture },
      uPlaneSize: { value: new THREE.Vector2() },
      uImageSize: { value: new THREE.Vector2() },
      uViewportSize: { value: new THREE.Vector2(viewport.value.width, viewport.value.height) },
      uTime: { value: 0 },
    },
    transparent: true,
    vertexShader: skillsVertex,
    fragmentShader: skillsFragment,
  });

  const img = new Image();
  img.src = image.src;
  img.onload = () => {
    texture.image = img;
    material.uniforms.uImageSize.value.set(img.naturalWidth, img.naturalHeight);
    texture.needsUpdate = true;
  };

  const mesh = new THREE.Mesh(geometry, material);
  setScale(mesh, el);

  return mesh;
};

const setScale = (mesh: THREE.Mesh, el: HTMLElement, x?: number | null, y?: number | null) => {
  x = x || el.offsetWidth;
  y = y || el.offsetHeight;
  mesh.scale.x = (viewport.value.width * x) / window.innerWidth;
  mesh.scale.y = (viewport.value.height * y) / window.innerHeight;

  mesh.material.uniforms.uPlaneSize.value = new THREE.Vector2(mesh.scale.x, mesh.scale.y);
};

const scrollWindow = () => {
  if (mediaRefs.value.length) {
    mediaRefs.value.forEach(({ mesh, initY }) => {
      const positionY =
        viewport.value.height / 2 -
        mesh.scale.y / 2 -
        ((initY - scrollY.value) / window.innerHeight) * viewport.value.height;

      mesh.position.y = positionY;
    });
  }
};
const resizeWindow = () => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  renderer.setSize(size.width, size.height);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  const fov = camera.fov * (Math.PI / 180);
  const height = 2 * Math.tan(fov / 2) * camera.position.z;
  const width = height * camera.aspect;
  viewport.value = { width, height };

  if (mediaRefs.value.length) {
    mediaRefs.value.forEach(({ el, mesh }) => {
      mesh.position.x =
        -(viewport.value.width / 2) + mesh.scale.x / 2 + ((el.offsetLeft + 15) / size.width) * viewport.value.width;
    });
  }
};

const animate = () => {
  renderer.render(scene, camera);

  mediaRefs.value.forEach(({ mesh }) => {
    mesh.material.uniforms.uTime.value += 0.04;
  });

  requestAnimationFrame(animate);
};

onMounted(() => {
  nextTick(() => {
    init();
    animate();
    scrollWindow();
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    window.addEventListener("scroll", () => {
      if (isOutroEnd.value) {
        scrollWindow();
      }
    });
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
  window.removeEventListener("scroll", scrollWindow);
});
</script>

<template>
  <div ref="skillWrapRef" :class="['skills', isOutroEnd && 'is-outro-end']">
    <canvas ref="skillsRef"></canvas>
    <div class="title-wrap">
      <strong>
        <span class="fw300">/&nbsp;</span>
        Make Your Mark
      </strong>

      <h2>Skills</h2>
    </div>

    <div class="sticky-wrap">
      <article class="inner-1">
        <div class="media-container">
          <figure class="media">
            <img src="@/public/images/skills/6.webp" alt="fashion" />
          </figure>
          <small>(01)</small>
        </div>
      </article>

      <article class="inner-2">
        <div class="media-container">
          <figure class="media">
            <img src="@/public/images/skills/1.webp" alt="silueta" />
          </figure>
          <small>(02)</small>
        </div>
        <div class="media-container">
          <figure class="media">
            <img src="@/public/images/skills/2.webp" alt="camera" />
          </figure>
          <small>(03)</small>
        </div>
        <div class="media-container">
          <figure class="media">
            <img src="@/public/images/skills/3.webp" alt="spheres" />
          </figure>
          <small>(04)</small>
        </div>
      </article>

      <article class="inner-3">
        <div class="media-container">
          <figure class="media">
            <img src="@/public/images/skills/4.webp" alt="diana" />
          </figure>
          <small>(05)</small>
        </div>
        <div class="media-container">
          <figure class="media">
            <img src="@/public/images/skills/5.webp" alt="abuelo" />
          </figure>
          <small>(06)</small>
        </div>
      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills {
  position: relative;
  margin-top: calc(-200dvh);
  background-color: #e8e8e8;
  isolation: isolate;
  z-index: -2;

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
    z-index: -1;
  }

  .title-wrap {
    padding: 6px 6px 0;
    color: #ffffff;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    strong {
      font-size: 10px;
      margin-bottom: 20px;
    }

    h2 {
      line-height: 1;
      letter-spacing: -7px;
      font-size: 175px;
      font-weight: 700;
    }
  }

  .inner-1 {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    .media-container {
      max-width: 1080px;

      .media {
        aspect-ratio: 1080 / 950;
      }
    }
  }

  .inner-2 {
    display: flex;
    .media-container {
      .media {
        height: 40.7142857vw;
      }
      &:nth-child(1) {
        width: 32.0713235%;
      }
      &:nth-child(2) {
        width: 51.8926471%;
      }
      &:nth-child(3) {
        width: 15.9558824%;
      }
      &:not(:last-child) {
        margin-right: var(--margin);
      }
    }
  }

  .inner-3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .media-container:first-child {
      width: 20%;
      .media {
        aspect-ratio: 1 / 1;
      }
    }
    .media-container:nth-child(2) {
      width: 61.8033989%;
      margin-top: var(--margin);
      .media {
        aspect-ratio: 376 / 400;
      }
    }
  }

  .media-container {
    width: 100%;
    display: inline-flex;
    flex-direction: column;

    .media {
      display: inline-flex;

      img {
        visibility: hidden;
      }
    }

    small {
      display: block;
      margin-top: 10px;
      text-align: center;
      line-height: 0.8;
      opacity: 0;
    }
  }

  article {
    margin: 125px auto 0;
    padding: 0 var(--margin);

    .media {
      outline: 1px solid red;
    }
  }
}
</style>
