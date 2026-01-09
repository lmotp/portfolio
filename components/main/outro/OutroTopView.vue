<script setup lang="ts">
import gsap from "gsap";
import LineLogo from "../LineLogo.vue";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

const scrollTriggerStore = useScrollTriggerStore();
const { isIntroEnd } = storeToRefs(scrollTriggerStore);
const videoSrc = usePublicAsset("/images/archives/2.mp4");

const init = () => {
  const mainTl = gsap.timeline({
    id: "outro-top-view",
    scrollTrigger: {
      trigger: ".video-scroller",
      start: `top+=${window.innerHeight}px top`,
      end: `bottom bottom`,
      scrub: true,
    },
  });

  mainTl.to(".layer, .logo-scroller", {
    xPercent: -10,
    yPercent: -10,
    rotate: -15,
    transformOrigin: "0% 100%",
    ease: "none",
  });
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div class="video-scroller">
    <div class="video-wrapper">
      <video
        playsinline
        muted
        autoplay
        loop
        controlslist="nodownload noplaybackrate"
        disablepictureinpicture
        :src="videoSrc"
      ></video>
    </div>
  </div>

  <div :class="['layer', isIntroEnd && 'is-intro-end']"></div>

  <div :class="['logo-scroller', isIntroEnd && 'is-intro-end']">
    <LineLogo />
  </div>
</template>

<style scoped>
.video-scroller {
  position: absolute;
  inset: 0 0 -100svh 0;

  .video-wrapper {
    position: sticky;
    top: 0;
    height: 100dvh;
    overflow: hidden;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: var(--dark-blue);
  mix-blend-mode: multiply;
  will-change: transform;
}

.logo-scroller {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100dvh;
  padding: 0 18px 18px;
  color: var(--beige);
}

.is-intro-end {
  position: absolute !important;
  top: 100dvh;
  left: 0;
}
</style>
