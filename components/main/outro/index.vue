<script setup lang="ts">
import gsap from "gsap";
import Logo from "./Logo.vue";

const init = () => {
  gsap.to(".layer", {
    scrollTrigger: {
      trigger: ".outro",
      start: "top 15px",
      end: "bottom bottom",
      scrub: true,
    },
    xPercent: -10,
    rotate: -15,
    transformOrigin: "0% 100%",
  });

  gsap.to(".logo-scroller", {
    scrollTrigger: {
      trigger: ".outro",
      start: "top 15px",
      end: "bottom bottom",
      scrub: true,
    },
    xPercent: -10,
    rotate: -15,
    transformOrigin: "0% 100%",
  });
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div class="outro">
    <div class="video-wrapper">
      <video
        playsinline
        muted
        autoplay
        loop
        controlslist="nodownload noplaybackrate"
        disablepictureinpicture
        src="https://player.vimeo.com/progressive_redirect/playback/1017272898/rendition/720p/file.mp4?loc=external&amp;log_user=0&amp;signature=d02d61e39102e10801a1316ce6ba75bc842b6f7008f05fe111b3cac233caf241"
      ></video>
    </div>

    <div class="layer"></div>

    <div class="logo-scroller">
      <div class="logo-wrapper">
        <Logo />
      </div>
    </div>
  </div>
</template>

<style scoped>
.outro {
  position: relative;
  width: 100%;
  height: 200svh;

  .video-wrapper {
    position: sticky;
    top: 0;
    height: 100lvh;
    overflow: hidden;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .layer {
    position: absolute;
    inset: 0;
    height: 100dvh;
    background-color: red;
    mix-blend-mode: multiply;
    will-change: transform;
  }

  .logo-scroller {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    height: 100svh;
    padding: 0 18px 18px;
    color: #e8e9ee;

    .logo-wrapper {
      position: relative;
      width: 100%;
    }
  }
}
</style>
