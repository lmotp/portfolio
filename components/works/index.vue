<script setup lang="ts">
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";
import * as THREE from "three";
import gsap from "gsap";

import GL from "./imageBlur/GL.js";
import usePublicAsset from "~/composables/usePublicAsset";

const { config, nextConfig } = defineProps<{ config: configType; nextConfig: nextConfigType }>();
const { id, title, desc, date, stack, src, type } = config;
const { nextTitle, nextSrc, nextType } = nextConfig;

const scrollTriggerStore = useScrollTriggerStore();
const { lenisRef } = storeToRefs(scrollTriggerStore);

const router = useRouter();

const isInit = ref(false);
const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const blurRef = ref<HTMLCanvasElement | null>(null);
const blurWrapRef = ref<HTMLDivElement | null>(null);
const pictureWrapRef = ref<HTMLDivElement | null>(null);
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
  isInit.value = true;

  if (pictureWrapRef.value) pictureWrapHeight.value = pictureWrapRef.value.getBoundingClientRect().height;

  setGsapAnimation();
  setDetailImage();
};

const setGsapAnimation = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".article-top",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  tl.fromTo(".article-top .picture", { transform: " scale(1.1)" }, { transform: "translateY(10%) scale(1)" });
};
const setDetailImage = () => {
  if (!blurRef.value || !blurWrapRef.value) return;

  const renderer = new THREE.WebGLRenderer({
    canvas: blurRef.value,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const gl = new GL(renderer, blurWrapRef.value);
  lenisRef.value?.on("scroll", (e) => {
    gl.onScroll(e);
  });
};

const handleClickNextWrok = () => {
  if (!bottomRef.value) return;

  const tl = gsap.timeline({
    onComplete: () => {
      const transformPath = nextTitle.toLowerCase().replace(" ", "");
      router.push(`/works/${transformPath}`);
    },
  });
  const mainTrigger = bottomRef.value?.querySelector(".bottom-picture-wrap");
  const textTrigger = bottomRef.value?.querySelector("h3");

  tl.to(mainTrigger, { translateY: `-${window.innerHeight - pictureWrapHeight.value + 150}px`, height: "100vh" }, 0);
  tl.to(textTrigger, { opacity: 0 }, 0);
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div ref="blurWrapRef" class="detail-wrap" :style="{ '--pictureWrapHeight': `${pictureWrapHeight}px` }">
    <canvas ref="blurRef" id="gl"></canvas>

    <article :id="`work-${id}`">
      <div class="article-top">
        <div ref="pictureWrapRef" class="main-picture-wrap">
          <div class="picture-bg"></div>

          <Transition name="init">
            <div v-show="!isInit" class="init-wrap">
              <img v-if="type === 'image'" :src="usePublicAsset(src)" :alt="title" />
              <video v-else playsinline muted autoplay :src="usePublicAsset(src)"></video>
            </div>
          </Transition>

          <img v-if="type === 'image'" class="picture" :src="usePublicAsset(src)" :alt="title" />
          <video
            v-else
            class="picture"
            playsinline
            muted
            autoplay
            loop
            controlslist="nodownload noplaybackrate"
            disablepictureinpicture
            :src="usePublicAsset(src)"
          ></video>
        </div>

        <div class="title-wrap">
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

    <article ref="bottomRef" class="bottom-section" @click="handleClickNextWrok" role="button">
      <strong>NEXT</strong>

      <div class="bottom-picture-wrap">
        <div class="picture-bg"></div>

        <img v-if="nextType === 'image'" class="picture" :src="usePublicAsset(nextSrc)" :alt="nextTitle" />
        <video
          v-else
          class="picture"
          playsinline
          muted
          autoplay
          loop
          controlslist="nodownload noplaybackrate"
          disablepictureinpicture
          :src="usePublicAsset(nextSrc)"
        ></video>

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
    height: 100dvh;
    isolation: isolate;

    .main-picture-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: stretch;
      flex: 1;
      width: 100%;
      min-height: 0;
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

        & > * {
          transform: scale(1.1);
        }
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
    margin-bottom: 120px;

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
    transform: translateY(150px);
    cursor: pointer;

    .bottom-picture-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: stretch;
      height: var(--pictureWrapHeight);
      width: 100%;
      min-height: 0;
      isolation: isolate;
      overflow: hidden;
      box-shadow: 0 0 0 1px #000a;

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
        transform: translate(-50%, calc(-50% - 75px));
      }
    }

    strong {
      line-height: 1;
      font-size: min(175px, 12.15278vw);
      color: #0b0d0f;
    }
  }

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
