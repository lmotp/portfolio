<script setup lang="ts">
import gsap from "gsap";
import LineLogo from "../LineLogo.vue";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const scrollTriggerStore = useScrollTriggerStore();
const { isIntroEnd } = storeToRefs(scrollTriggerStore);

const pageTransitionStore = usePageTransitionStore();
const { downloadPercent } = storeToRefs(pageTransitionStore);

const videoSrc = ref("");

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
const setupVideoSrc = async () => {
  const targetVideo = usePublicAsset("/videos/archives/2.mp4");

  try {
    const response = await fetch(targetVideo);
    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get("Content-Length") ?? "0");

    let receivedLength = 0;
    let chunks = [];

    while (true) {
      const { done, value }: any = await reader?.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      downloadPercent.value = Math.round((receivedLength / contentLength) * 100);
    }

    const blob = new Blob(chunks);
    videoSrc.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error("데이터 로드 중 오류:", error);
  }
};

onMounted(async () => {
  await setupVideoSrc();
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
