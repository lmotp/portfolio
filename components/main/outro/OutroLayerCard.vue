<script setup lang="ts">
import gsap from "gsap";

type cardType = {
  id: number;
  url: string;
  title: string;
  type: string;
  src: string;
  isLast: boolean;
};

const props = defineProps<cardType>();
const cardWrapRef = ref<HTMLElement | null>(null);
const infoWrapperRef = ref<HTMLElement | null>(null);
const imageWrapperRef = ref<HTMLElement | null>(null);

const maskIndex = ref(0);

const init = () => {
  const f = document.body.querySelector(`.layer-card-trigger:nth-child(${props.id})`) as HTMLElement;

  const r = gsap.timeline({
    paused: !0,
    scrollTrigger: {
      trigger: f,
      start: "top bottom",
      end: "top top",
      scrub: !0,
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

  l.to(
    infoWrapperRef.value,
    {
      yPercent: props.isLast ? 0 : -80,
      xPercent: props.isLast ? 0 : -25,
      rotate: props.isLast ? 0 : -7,
      force3D: !0,
      ease: "none",
    },
    0
  );

  l.to(
    imageWrapperRef.value,
    {
      yPercent: -50,
      xPercent: -5,
      rotate: -5,
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
  <div ref="cardWrapRef" :class="['layer-card-wrap']" :style="{ '--mask-index': maskIndex }">
    <div ref="infoWrapperRef" class="info-wrapper"></div>
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
  overflow: hidden;

  .info-wrapper {
    width: 100%;
    height: 100%;
    background-color: #dedfe3f2;
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

@media screen and (max-width: 1000px) {
  .layer-card-wrap {
    .info-wrapper {
    }

    .image-wrapper {
      top: 24%;
    }
  }
}
</style>
