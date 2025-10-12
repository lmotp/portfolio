<script setup lang="ts">
import * as THREE from "three";
import skillsVertex from "~/shaders/skills/skillsVertex.glsl";
import skillsFragment from "~/shaders/skills/skillsFragment.glsl";

import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

const scrollTriggerStore = useScrollTriggerStore();
const { isOutroEnd } = storeToRefs(scrollTriggerStore);

const skillsRef = ref<HTMLCanvasElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

const easeInOut = (t: number) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

const init = () => {
  if (!skillsRef.value || !contentRef.value) return;

  const group = new THREE.Group();
  const images = contentRef.value.querySelectorAll(".media");
  const size = {
    width: window.innerWidth,
    height: window.innerHeight - 30,
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
    const mesh = setImageMesh(el, image) as any;
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
  const viewport = { width, height };

  const geometry = new THREE.PlaneGeometry(1, 1, 50, 100);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      tMap: { value: texture },
      uPlaneSize: { value: new THREE.Vector2() },
      uImageSize: { value: new THREE.Vector2() },
      uViewportSize: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uTime: { value: 100 * Math.random() },
      uBlurStrength: { value: 1 },
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

  const x = el.offsetWidth;
  const y = el.offsetHeight;
  mesh.scale.x = (viewport.width * x) / window.innerWidth;
  mesh.scale.y = (viewport.height * y) / window.innerHeight;
  material.uniforms.uPlaneSize.value = new THREE.Vector2(mesh.scale.x, mesh.scale.y);


  return mesh;
};

const animate = () => {
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
};

const resizeWindow = () => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight - 30,
  };

  renderer.setSize(size.width, size.height);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
};

onMounted(() => {
  nextTick(() => {
    init();
    animate();
    window.addEventListener("resize", resizeWindow);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>

<template>
  <div :class="['skills', isOutroEnd && 'is-outro-end']">
    <canvas ref="skillsRef"></canvas>
    <div class="title-wrap">
      <strong>
        <span class="fw300">/&nbsp;</span>
        Make Your Mark
      </strong>

      <h2>Skills</h2>
    </div>

    <div ref="contentRef" class="skills-content">
      <article class="inner-1">
        <h2>
          <small>by Jorge Toloza</small>
          <span>WebGL / OGL</span>
          <strong>Progressive Blur</strong>
        </h2>

        <div class="media-container">
          <figure class="media">
            <img src="@/public/images/skills/6.webp" alt="fashion" />
          </figure>
          <small>(01)</small>
        </div>
      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills {
  position: relative;
  padding-block: 0;
  width: 100%;
  height: 300dvh;
  background-color: #e8e8e8;
  isolation: isolate;

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
    z-index: -1;
  }

  .title-wrap {
    position: absolute;
    top: 15px;
    left: 15px;
    height: calc(100dvh - 15px);
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

  .skills-content {
    padding: 0 30px;

    .inner-1 {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      h2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: normal;
        margin-bottom: 40px;
        font-size: clamp(1.5rem, 6.5vw, 8rem);
        line-height: 1;

        & > * {
          &:not(:last-child) {
            margin-bottom: 15px;
          }
        }

        small,
        strong {
          display: block;
        }
        small {
          font-size: 0.175em;
        }
        span {
          font-size: 0.5em;
          text-transform: uppercase;
        }
        strong {
          font-weight: 600;
          line-height: 0.9;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }
      }

      .media-container {
        max-width: 1080px;
        .media {
          aspect-ratio: 1080 / 950;
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
  }
}
</style>
