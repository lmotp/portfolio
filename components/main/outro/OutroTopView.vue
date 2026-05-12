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

const prefersReducedMotion = useReducedMotion();
const posterSrc = usePublicAsset("/images/archives/2.png");
const targetVideoSrc = usePublicAsset("/videos/archives/2.mp4");
const videoRef = ref<HTMLVideoElement | null>(null);
const videoSrc = ref("");
const videoObjectUrl = ref("");
let videoRequest: XMLHttpRequest | null = null;

const isSafariBrowser = () => {
  if (!import.meta.client) return false;

  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Edg|OPR|FxiOS|Firefox/i.test(ua);
};

const revokeVideoObjectUrl = () => {
  if (!videoObjectUrl.value) return;

  URL.revokeObjectURL(videoObjectUrl.value);
  videoObjectUrl.value = "";
};

const syncVideoPlayback = async () => {
  if (!videoRef.value || !videoSrc.value) return;

  videoRef.value.load();

  try {
    await videoRef.value.play();
  } catch (error) {
    console.warn("비디오 자동 재생을 시작하지 못했습니다:", error);
  }
};

const syncVideoLoad = () => {
  if (!videoRef.value || !videoSrc.value) return;

  videoRef.value.load();
};

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
  if (isSafariBrowser()) {
    revokeVideoObjectUrl();
    videoSrc.value = targetVideoSrc;
    downloadPercent.value = 100;

    await nextTick();
    syncVideoLoad();
    return;
  }

  try {
    revokeVideoObjectUrl();

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      videoRequest = xhr;

      xhr.open("GET", targetVideoSrc, true);
      xhr.responseType = "blob";

      xhr.onprogress = (event) => {
        if (!event.lengthComputable || event.total <= 0) return;

        downloadPercent.value = Math.round((event.loaded / event.total) * 100);
      };

      xhr.onload = async () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(`Unexpected status code: ${xhr.status}`));
          return;
        }

        const responseBlob = xhr.response;
        const blob =
          responseBlob instanceof Blob && responseBlob.type
            ? responseBlob
            : new Blob([responseBlob], { type: "video/mp4" });

        videoObjectUrl.value = URL.createObjectURL(blob);
        videoSrc.value = videoObjectUrl.value;
        downloadPercent.value = 100;

        await nextTick();
        await syncVideoPlayback();
        resolve();
      };

      xhr.onerror = () => reject(new Error("Video request failed"));
      xhr.onabort = () => reject(new DOMException("Video request aborted", "AbortError"));
      xhr.send();
    });
  } catch (error) {
    console.error("데이터 로드 중 오류:", error);
    videoSrc.value = targetVideoSrc;
    downloadPercent.value = 100;

    await nextTick();
    await syncVideoPlayback();
  } finally {
    videoRequest = null;
  }
};

onMounted(async () => {
  if (prefersReducedMotion.value) {
    isIntroEnd.value = true;
    return;
  }

  await setupVideoSrc();
  nextTick(init);
});

onUnmounted(() => {
  videoRequest?.abort();
  revokeVideoObjectUrl();
});
</script>

<template>
  <div class="video-scroller">
    <div class="video-wrapper">
      <img v-if="prefersReducedMotion" :src="posterSrc" alt="Archive preview still for the outro section" />
      <video
        ref="videoRef"
        v-else
        preload="auto"
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

    img {
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
