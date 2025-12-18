<script setup lang="ts">
import gsap from "gsap";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

type cardType = {
  id: number;
  url: string;
  title: string;
  type: string;
  src: string;
  isLast: boolean;
};

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger } = storeToRefs(scrollTriggerStore);

const props = defineProps<cardType>();
const emits = defineEmits(["onClickCard"]);
const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const isInit = ref(false);
const cardWrapRef = ref<HTMLElement | null>(null);
const infoWrapperRef = ref<HTMLElement | null>(null);
const imageWrapperRef = ref<HTMLElement | null>(null);

const init = () => {
  const f = document.body.querySelector(`.layer-card-trigger:nth-child(${props.id})`) as HTMLElement;

  scrollTrigger.value?.create({
    trigger: f,
    start: props.id === 0 ? "top bottom" : "top 55%",
    end: "bottom top",
    scrub: true,
    onEnter: () => {
      isInit.value = true;
    },
    onEnterBack: () => {
      isInit.value = true;
    },
    onLeaveBack: () => {
      isInit.value = false;
    },
    onLeave: () => {
      isInit.value = false;
    },
  });
  const r = gsap.timeline({
    paused: !0,
    scrollTrigger: {
      trigger: f,
      start: "top bottom",
      end: "top top",
      scrub: !0,
    },
  });
  const l = gsap.timeline({
    paused: !0,
    scrollTrigger: {
      trigger: f,
      start: "top top+=1",
      end: "bottom top",
      scrub: !0,

      onEnterBack: () => {
        if (!cardWrapRef.value) return;
        cardWrapRef.value.style.pointerEvents = "auto";
      },
      onLeave: () => {
        if (!cardWrapRef.value) return;
        cardWrapRef.value.style.pointerEvents = "none";
      },
    },
  });

  r.fromTo(
    infoWrapperRef.value,
    {
      yPercent: 110,
      xPercent: 15,
      rotate: 15,
      transformOrigin: "top left",
    },
    {
      yPercent: 0,
      xPercent: 0,
      rotate: 0,
      force3D: !0,
      ease: "none",
    },
    0
  );

  r.fromTo(
    imageWrapperRef.value,
    {
      yPercent: 130,
      xPercent: 20,
      rotate: 15,
    },
    {
      yPercent: 0,
      xPercent: 0,
      rotate: 0,
      force3D: !0,
      ease: "none",
    },
    0.06
  );

  l.to(
    infoWrapperRef.value,
    {
      yPercent: props.isLast ? 0 : isMobile.value ? 0 : -80,
      xPercent: props.isLast ? 0 : isMobile.value ? 0 : -25,
      rotate: props.isLast ? 0 : isMobile.value ? 0 : -7,
      force3D: !0,
      ease: "none",
    },
    0
  );

  l.to(
    imageWrapperRef.value,
    {
      yPercent: props.isLast ? 0 : isMobile.value ? 0 : -50,
      xPercent: props.isLast ? 0 : isMobile.value ? 0 : -5,
      rotate: props.isLast ? 0 : isMobile.value ? 0 : -5,
      force3D: !0,
      ease: "none",
    },
    0
  );
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div ref="cardWrapRef" :class="['layer-card-wrap', isInit ? 'active' : '']">
    <div ref="infoWrapperRef" class="info-wrapper">
      <div class="info-wraaper-title">
        <strong class="title">Zigma</strong>
        <button @click="$emit('onClickCard', id)">버튼</button>
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
      <NuxtLink class="link" :to="props.url">
        <figure>
          <img v-if="props.type === 'image'" :src="props.src" :alt="props.title" />
          <video
            v-else
            playsinline
            muted
            autoplay
            loop
            controlslist="nodownload noplaybackrate"
            disablepictureinpicture
            :src="props.src"
          ></video>
        </figure>
      </NuxtLink>
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
    background-color: #dedfe3f2;

    .info-wraaper-title {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 2.31481vw 0.46296vw 0;

      .title {
        font-size: 5.55556vw;
        line-height: 0.8;
      }
    }

    .field-guide {
      position: absolute;
      border: 1.5px dashed #0b0b0b;
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
        border: 1.5px solid #0b0b0b;

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
        border: 1.5px dashed #0b0b0b;
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
          font-size: 40px;
        }
      }

      .field-guide {
        top: 24%;
        right: 8px;
        bottom: 8px;
        left: 8px;
        border: 1px dashed #0b0b0b;

        .field-guide-wrapper {
          border: 1px solid #0b0b0b;
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
          border: 1px dashed #0b0b0b;
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
