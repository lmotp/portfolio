<script setup lang="ts">
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";
import * as THREE from "three";
import gsap from "gsap";

import GL from "./imageBlur/GL.js";
import usePublicAsset from "~/composables/usePublicAsset";

const { config, nextConfig } = defineProps<{ config: configType; nextConfig: nextConfigType }>();
const { id, title, desc, date, stack, src } = config;
const { nextTitle, nextSrc } = nextConfig;

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, lenisRef } = storeToRefs(scrollTriggerStore);

const router = useRouter();
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let animationId: any;
let onResize: any;

const isDisposed = ref(false);
const isInit = ref(false);
const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const blurRef = ref<HTMLCanvasElement | null>(null);
const blurWrapRef = ref<HTMLDivElement | null>(null);
const titleWrapRef = ref<HTMLDivElement | null>(null);
const bottomRef = ref<HTMLDivElement | null>(null);
const pictureWrapHeight = ref(window.innerHeight / 2);

const icons = computed(() => {
  return [
    { name: "Nuxt", src: "simple-icons:nuxtdotjs" },
    { name: "SCSS", src: "simple-icons:sass" },
    { name: "Chart", src: "simple-icons:chartdotjs" },
    { name: "Storybook", src: "simple-icons:storybook" },
    { name: "Express", src: "simple-icons:express" },
  ].map((v) => ({ ...v, isActive: stack?.includes(v.name) }));
});

const init = () => {
  if (titleWrapRef.value) pictureWrapHeight.value = window.innerHeight - titleWrapRef.value.offsetHeight;
  isInit.value = true;

  setGsapAnimation();
  setDetailImage();
};

const setGsapAnimation = () => {
  const tl = gsap.timeline({
    id: `work-${id}-picture`,
    scrollTrigger: {
      trigger: ".article-top",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  tl.fromTo(".article-top .picture", { transform: " scale(1)" }, { transform: "translateY(10%) scale(1)" });
};
const setDetailImage = () => {
  if (!blurRef.value || !blurWrapRef.value) return;

  renderer = new THREE.WebGLRenderer({
    canvas: blurRef.value,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  scene = new THREE.Scene();

  const gl = new GL(renderer, scene, isDisposed.value, blurWrapRef.value);
  animationId = gl.animationId;
  onResize = gl.onResize;
  lenisRef.value?.on("scroll", (e) => {
    gl.onScroll(e);
  });
};

const handleClickNextWrok = () => {
  if (!bottomRef.value) return;
  lenisRef.value!.stop();

  const tl = gsap.timeline({
    id: `work-${id}`,
    onComplete: () => {
      tl.scrollTrigger?.kill();
      tl.kill();

      gsap.getById(`work-${id}`)?.kill();

      const transformPath = nextTitle.toLowerCase();
      router.push(`/works/${transformPath}`);
    },
  });
  const mainTrigger = bottomRef.value?.querySelector(".bottom-picture-wrap");
  const textTrigger = bottomRef.value?.querySelector("h3");

  tl.to(mainTrigger, { translateY: `${window.innerHeight * -0.5}px`, height: `${window.innerHeight}px` }, 0);
  tl.to(textTrigger, { opacity: 0 }, 0);
};

onMounted(async () => {
  setTimeout(() => {
    lenisRef.value!.start();
  }, 1000);

  window.scrollTo(0, 0); // 브라우저 위치 초기화
  lenisRef.value!.scrollTo(0, { immediate: true }); // Lenis 내부 위치 초기화

  await nextTick(init);

  scrollTrigger.value!.refresh();
});

onUnmounted(() => {
  isDisposed.value = true;

  if (animationId) cancelAnimationFrame(animationId);

  scene.traverse((obj: any) => {
    if (obj.isMesh) {
      if (obj.geometry) obj.geometry.dispose();

      if (obj.material) {
        // 배열 형태의 재질 대응
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of materials) {
          // 텍스처 해제
          Object.keys(m).forEach((key) => {
            if (m[key] && m[key].isTexture) {
              m[key].dispose();
            }
          });
          m.dispose();
        }
      }
    }
  });

  window.removeEventListener("resize", onResize);

  renderer.renderLists.dispose();
  renderer.dispose();
});
</script>

<template>
  <div ref="blurWrapRef" class="detail-wrap" :style="{ '--pictureWrapHeight': `${pictureWrapHeight}px` }">
    <canvas ref="blurRef" id="gl"></canvas>

    <article :id="`work-${id}`">
      <div class="article-top">
        <div class="main-picture-wrap">
          <div class="picture-bg"></div>

          <Transition name="init">
            <div v-if="!isInit" class="init-wrap">
              <img :src="usePublicAsset(src)" :alt="title" />
            </div>
          </Transition>

          <img class="picture" :src="usePublicAsset(src)" :alt="title" />
        </div>

        <div ref="titleWrapRef" class="title-wrap">
          <h2>{{ title }}</h2>

          <ul>
            <li v-for="(svg, id) of icons" :key="`stack-${id}`">
              <Icon :name="svg.src" :size="isMobile ? 30 : 40" :class="['icon', svg.isActive && 'active']" />
            </li>
          </ul>
          <time :datetime="date">{{ date }}</time>
        </div>
      </div>

      <div class="info-wrap">
        <p>{{ desc }}</p>

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
                <img src="@/public/images/skills/2.webp" alt="spheres" />
              </figure>
              <small>(04)</small>
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
    </article>

    <article ref="bottomRef" class="bottom-section" role="button" :data-detail="true" @click="handleClickNextWrok">
      <strong>NEXT</strong>

      <div class="bottom-picture-wrap">
        <div class="picture-bg"></div>
        <img class="picture" :src="usePublicAsset(nextSrc)" :alt="nextTitle" />
        <h3>{{ nextTitle }}</h3>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.detail-wrap {
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
    z-index: -1;
  }

  .article-top {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100dvh;
    isolation: isolate;

    .main-picture-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: stretch;
      width: 100%;
      height: var(--pictureWrapHeight);
      flex-shrink: 0;
      isolation: isolate;
      overflow: hidden;
      box-shadow: 0 0 0 1px #000a;
      z-index: 1;

      .init-wrap {
        position: fixed;
        width: 100%;
        height: 100vh;
        background-color: white;
        overflow: hidden;
        z-index: 99;

        &.init-leave-active {
          transition: height 1s ease-in-out;
        }
        &.init-leave-to {
          height: var(--pictureWrapHeight);
        }

        /* & > * {
          transform: scale(1.1);
        } */
      }

      .picture-bg {
        display: flex;
        position: absolute;
        inset: 0%;
        background-image: linear-gradient(#000c, #fff0 55%);
        pointer-events: none;
        user-select: none;
        z-index: 101;
      }
    }

    .title-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-block: 32px 42px;
      text-align: center;

      h2 {
        font-size: 96px;
        text-transform: uppercase;
        color: #0b0d0f;
        line-height: 1.5;
      }

      ul {
        display: flex;
        gap: 18px;
        margin-bottom: 24px;

        li {
          display: flex;

          span {
            color: #e8e8e8;

            &.active {
              color: #0b0d0f;
            }
          }
        }
      }

      time {
        font-size: 14px;
        color: #868a93;
        white-space: pre-wrap;
      }
    }
  }

  .info-wrap {
    margin-bottom: 250px;

    p {
      font-size: 18px;
      text-align: center;
      color: #0b0d0f;
      white-space: pre-wrap;
    }

    .sticky-wrap {
      .inner-1 {
        display: flex;
        justify-content: center;

        .media-container {
          max-width: 800px;

          .media {
            aspect-ratio: 1 / 0.8796296296296297;
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
      }
    }
  }

  .bottom-section {
    position: relative;
    cursor: pointer;

    .bottom-picture-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: stretch;
      height: 50dvh;
      width: 100%;
      min-height: 0;
      isolation: isolate;
      overflow: hidden;
      box-shadow: 0 0 0 1px #000a;
      pointer-events: none;

      .picture-bg {
        display: flex;
        position: absolute;
        inset: 0%;
        background-image: linear-gradient(#000c, #fff0 55%);
        pointer-events: none;
        user-select: none;
        z-index: 1;
      }

      h3 {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 96px;
        color: #fff;
        transform: translate(-50%, -50%);
        text-transform: uppercase;
        white-space: nowrap;
      }
    }

    strong {
      line-height: 1;
      font-size: min(120px, 12.15278vw);
      color: #0b0d0f;
      pointer-events: none;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
}

@media screen and (max-width: 768px) {
  .detail-wrap {
    .article-top {
      .title-wrap {
        h2 {
          font-size: 56px;
        }
        time {
          font-size: 12px;
        }
      }
    }

    .info-wrap {
      p {
        font-size: 12px;
      }
      .sticky-wrap {
        article {
          margin-top: 60px;
        }
      }
    }

    .bottom-section {
      .bottom-picture-wrap {
        h3 {
          font-size: 56px;
        }
      }

      strong {
        font-size: 72px;
      }
    }
  }
}
</style>
