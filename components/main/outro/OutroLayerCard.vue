<script setup lang="ts">
import gsap from "gsap";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

import usePublicAsset from "~/composables/usePublicAsset";

type configType = {
  id: number;
  title: string;
  src: string;
  stack: string[];
  data: {
    desc: string;
    date: string;
    link: string;
    content: { img: string; caption: string }[];
  }[];
};

type cardType = configType & {
  isLast: boolean;
};

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger } = storeToRefs(scrollTriggerStore);

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const props = defineProps<cardType>();
const emits = defineEmits(["onClickCard"]);
const isInit = ref(false);
const infoWrapperRef = ref<HTMLElement | null>(null);
const imageWrapperRef = ref<HTMLElement | null>(null);
const mm = shallowRef<gsap.MatchMedia | null>(null);

const init = () => {
  const f = document.body.querySelector(`.layer-card-trigger:nth-child(${props.id})`) as HTMLElement;
  mm.value = gsap.matchMedia();
  mm.value.add(
    {
      // 중단점 설정
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)",
    },
    (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };

      scrollTrigger.value?.create({
        trigger: f,
        start: props.id === 0 ? "top bottom" : "top 55%",
        end: "bottom top",
        scrub: true,
        onToggle: (self) => (isInit.value = self.isActive),
      });

      const r = gsap.timeline({
        scrollTrigger: {
          trigger: f,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });

      r.fromTo(
        infoWrapperRef.value,
        { yPercent: 110, xPercent: 15, rotate: 15, transformOrigin: "top left" },
        { yPercent: 0, xPercent: 0, rotate: 0, force3D: true, ease: "none" },
        0,
      );

      r.fromTo(
        imageWrapperRef.value,
        { yPercent: 130, xPercent: 20, rotate: 15 },
        { yPercent: 0, xPercent: 0, rotate: 0, force3D: true, ease: "none" },
        0.06,
      );

      const l = gsap.timeline({
        scrollTrigger: {
          trigger: f,
          start: "top top+=1",
          end: "bottom top",
          scrub: true,
        },
      });

      // 모바일/데스크탑 수치 분기 처리
      const moveProps =
        isMobile || props.isLast
          ? { yPercent: 0, xPercent: 0, rotate: 0 }
          : { yPercent: -80, xPercent: -25, rotate: -7 };

      const imgMoveProps =
        isMobile || props.isLast
          ? { yPercent: 0, xPercent: 0, rotate: 0 }
          : { yPercent: -50, xPercent: -5, rotate: -5 };

      l.to(infoWrapperRef.value, { ...moveProps, force3D: true, ease: "none" }, 0);
      l.to(imageWrapperRef.value, { ...imgMoveProps, force3D: true, ease: "none" }, 0);
    },
  );
};

const handleClickRouter = (menuPath: string) => {
  const transformPath = menuPath.toLowerCase();
  transformPath === path.value ? null : (path.value = `/archives/${transformPath}`);
};

onMounted(() => {
  nextTick(init);
});

onUnmounted(() => {
  if (mm.value) mm.value.revert();
});
</script>

<template>
  <div :class="['layer-card-wrap', isInit ? 'active' : '']">
    <div ref="infoWrapperRef" class="info-wrapper">
      <div class="info-wraaper-title">
        <strong class="title">{{ props.title }}</strong>
        <button :data-detail="true" @click="handleClickRouter(props.title)">View Project</button>
      </div>
      <div class="field-guide">
        <span class="field-guide-label top-left"> Overscan </span>
        <span class="field-guide-label top-right">
          1427&nbsp;
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" class="field-guide-x">
            <path d="M9.997 11.915 0 1.935 1.926 0l9.989 9.989zm-8.07 0L0 9.989 9.997 0l1.918 1.935z"></path>
          </svg>
          &nbsp;627
        </span>

        <div class="field-guide-wrapper">
          <span class="field-guide-label top-left"> Crop </span>
          <span class="field-guide-label top-right">
            1324&nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" class="field-guide-x">
              <path d="M9.997 11.915 0 1.935 1.926 0l9.989 9.989zm-8.07 0L0 9.989 9.997 0l1.918 1.935z"></path>
            </svg>
            &nbsp;524
          </span>
          <span class="field-guide-label bottom-right"> 100% </span>
          <span class="field-guide-label top-left-outer"> [ 16:9 ] </span>
          <span class="field-guide-crosshair"></span>
          <span class="field-guide-bars hor"></span>
          <span class="field-guide-bars vert"></span>
        </div>

        <div class="field-guide-inner">
          <span class="field-guide-label top-left"> Action Safe </span>
          <span class="field-guide-label top-right">
            1261&nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" class="field-guide-x">
              <path d="M9.997 11.915 0 1.935 1.926 0l9.989 9.989zm-8.07 0L0 9.989 9.997 0l1.918 1.935z"></path>
            </svg>
            &nbsp;478
          </span>
        </div>
      </div>
    </div>

    <div ref="imageWrapperRef" class="image-wrapper">
      <button class="link" :data-detail="true" @click="handleClickRouter(props.title.toLowerCase())">
        <figure>
          <img :src="usePublicAsset(props.src)" :alt="props.title" />
        </figure>
      </button>
    </div>
  </div>
</template>

<style scoped>
.layer-card-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  pointer-events: none;

  &.active {
    pointer-events: auto;
  }

  .info-wrapper {
    width: 100%;
    height: 100%;
    background-color: var(--layer-card-info-bg);

    .info-wraaper-title {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 2.31481vw 0.46296vw 0;

      .title {
        font-size: 5.55556vw;
        line-height: 0.8;
      }

      button {
        position: relative;
        text-transform: uppercase;
        font-weight: bold;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 2px;
          background-color: black;
          transform: scaleX(0);
          transition: transform 0.3s ease-in-out;
        }

        &:hover::after {
          transform: scaleX(1);
        }
      }
    }

    .field-guide {
      position: absolute;
      border: 1.5px dashed var(--black);
      top: 16%;
      right: 0.46296vw;
      bottom: 0.46296vw;
      left: 0.46296vw;

      .field-guide-wrapper {
        position: absolute;
        top: 3.47222vw;
        right: 3.47222vw;
        bottom: 3.47222vw;
        left: 3.47222vw;
        border: 1.5px solid var(--black);

        .field-guide-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -9px;
          margin-top: -9px;
          width: 18px;
          height: 18px;

          &::after,
          &::before {
            background-color: currentColor;
            content: "";
            position: absolute;
          }

          &::before {
            top: 0;
            left: calc(50% - 0.75px);
            bottom: 0;
            width: 1.5px;
          }
          &::after {
            top: calc(50% - 0.75px);
            left: 0;
            right: 0;
            height: 1.5px;
          }
        }

        .field-guide-bars {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          position: absolute;

          &.hor {
            &::after,
            &::before {
              content: "";
              position: absolute;
              top: 50%;
              height: 1.5px;
              width: 20px;
              background-color: currentColor;
            }

            &::after {
              right: 100%;
            }
            &::before {
              left: 100%;
            }
          }
          &.vert {
            &::after,
            &::before {
              content: "";
              position: absolute;
              left: 50%;
              height: 20px;
              width: 1.5px;
              background-color: currentColor;
            }

            &::after {
              top: 100%;
            }
            &::before {
              bottom: 100%;
            }
          }
        }
      }

      .field-guide-inner {
        position: absolute;
        top: 5.09259vw;
        right: 5.6713vw;
        bottom: 5.09259vw;
        left: 5.6713vw;
        border: 1.5px dashed var(--black);
      }

      .field-guide-label {
        position: absolute;
        display: flex;
        align-items: center;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.69444vw;

        &.top-left {
          top: 0.23148vw;
          left: 0.46296vw;
        }

        &.top-left-outer {
          bottom: calc(100% + 0.34722vw);
          left: -0.17361vw;
          line-height: 1.1667;
        }

        &.top-right {
          top: 0.23148vw;
          right: 0.46296vw;
        }
        &.bottom-left {
          bottom: 0.23148vw;
          left: 0.46296vw;
        }
        &.bottom-right {
          bottom: 0.23148vw;
          right: 0.46296vw;
        }

        .field-guide-x {
          height: 0.34722vw;
          width: 0.34722vw;
        }
      }
    }
  }

  .image-wrapper {
    position: absolute;
    top: 16%;
    left: 0;
    width: 100%;
    height: 100%;

    .link {
      position: absolute;
      inset: 0;

      figure {
        height: 100%;

        > * {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(85%);
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .layer-card-wrap {
    .info-wrapper {
      .info-wraaper-title {
        height: 24%;
        padding: 0 8px 20px;

        .title {
          font-size: 32px;
        }
        button {
          font-size: 12px;
        }
      }

      .field-guide {
        top: 24%;
        right: 8px;
        bottom: 8px;
        left: 8px;
        border: 1px dashed var(--black);

        .field-guide-wrapper {
          border: 1px solid var(--black);
          top: 42px;
          right: 42px;
          bottom: 42px;
          left: 42px;

          .field-guide-wrapper-svg {
            left: -16px;
            top: -14px;
            width: 8px;
            height: 8px;
          }

          .field-guide-crosshair {
            margin-left: -7px;
            margin-top: -7px;
            width: 14px;
            height: 14px;

            &::before {
              top: 0;
              left: calc(50% - 0.5px);
              bottom: 0;
              width: 1px;
            }
            &::after {
              top: calc(50% - 0.5px);
              left: 0;
              right: 0;
              height: 1px;
            }
          }

          .field-guide-bars {
            &.hor {
              &::after,
              &::before {
                height: 1px;
                width: 18px;
              }
            }
            &.vert {
              &::after,
              &::before {
                height: 18px;
                width: 1px;
              }
            }
          }
        }

        .field-guide-inner {
          top: 68px;
          right: 78px;
          bottom: 68px;
          left: 78px;
          border: 1px dashed var(--black);
        }

        .field-guide-label {
          font-size: 12px;

          &.top-left {
            top: 2px;
            left: 4px;
          }

          &.top-left-outer {
            bottom: calc(100% + 4px);
            left: -3px;
          }

          &.top-right {
            top: 2px;
            right: 4px;
          }

          &.bottom-left {
            bottom: 2px;
            left: 4px;
          }

          &.bottom-right {
            bottom: 2px;
            right: 4px;
          }

          .field-guide-x {
            width: 6px;
            height: 6px;
          }
        }
      }
    }

    .image-wrapper {
      top: 24%;
    }
  }
}
</style>
