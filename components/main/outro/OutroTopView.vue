<script setup lang="ts">
import gsap from "gsap";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

const scrollTriggerStore = useScrollTriggerStore();
const { isIntroEnd } = storeToRefs(scrollTriggerStore);

const init = () => {
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".top-view-container",
      start: `top+=${window.innerHeight}px top`,
      end: `bottom bottom`,
      scrub: true,
    },
  });

  // 애니메이션 대상을 .layer와 .logo-scroller로 지정
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
        src="https://player.vimeo.com/progressive_redirect/playback/1017272898/rendition/720p/file.mp4?loc=external&amp;log_user=0&amp;signature=d02d61e39102e10801a1316ce6ba75bc842b6f7008f05fe111b3cac233caf241"
      ></video>
    </div>
  </div>

  <div :class="['layer', isIntroEnd && 'is-intro-end']"></div>

  <div :class="['logo-scroller', isIntroEnd && 'is-intro-end']">
    <div class="logo-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1684 317" class="preloader__logo">
        <g
          class="logo__line"
          data-svg-origin="0 158.29700088500977"
          transform="matrix(1,0,0,1,0,0)"
          style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
        >
          <path d="M1684 113.277v90.04H0v-90.04h1684Z"></path>
        </g>
        <g class="logo__letter logo__letter--t" style="opacity: 1">
          <path
            class="logo__shape logo__shape--xy"
            d="M69.8047 0h95.9793v316.592H69.8047V0Z"
            data-svg-origin="117.79434967041016 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--xy"
            d="M235.586 0v90.0399H.001V0h235.585Z"
            data-svg-origin="117.79350335698109 45.01995086669922"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
        </g>
        <g class="logo__letter logo__letter--h" style="opacity: 1">
          <path
            class="logo__shape logo__shape--xy"
            d="M258.852 0h95.979v316.592h-95.979V0Z"
            data-svg-origin="306.84149169921875 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--xy"
            d="M415.907 0h95.979v316.592h-95.979V0Z"
            data-svg-origin="463.8965148925781 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
        </g>
        <g class="logo__letter logo__letter--e" style="opacity: 1">
          <path
            class="logo__shape logo__shape--xy"
            d="M535.156 0h95.979v316.592h-95.979V0Z"
            data-svg-origin="583.1455078125 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--y"
            d="M735.842 226.551v90.04H535.158v-90.04h200.684Z"
            data-svg-origin="635.5000305175781 271.5709991455078"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--y"
            d="M735.842 0v90.0399H535.158V0h200.684Z"
            data-svg-origin="635.5000305175781 45.01995086669922"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
        </g>
        <g class="logo__letter logo__letter--l" style="opacity: 1">
          <path
            class="logo__shape logo__shape--x"
            d="M852.18 0h95.979v316.592H852.18V0Z"
            data-svg-origin="900.1694946289062 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--y"
            d="M1035.41 226.551v90.04H852.177v-90.04h183.233Z"
            data-svg-origin="943.7935180664062 271.5709991455078"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
        </g>
        <g class="logo__letter logo__letter--i" style="opacity: 1">
          <path
            class="logo__shape logo__shape--xy"
            d="M1058.68 0h95.98v316.592h-95.98V0Z"
            data-svg-origin="1106.6700439453125 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
        </g>
        <g class="logo__letter logo__letter--n" style="opacity: 1">
          <path
            class="logo__shape logo__shape--xy"
            d="M1177.93 0h95.98v316.592h-95.98V0Z"
            data-svg-origin="1225.9200439453125 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--xy"
            d="M1177.93 0h95.98l186.14 316.592h-95.98L1177.93 0Z"
            data-svg-origin="1318.9900512695312 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--xy"
            d="M1364.07 0h95.98v316.592h-95.98V0Z"
            data-svg-origin="1412.0599365234375 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
        </g>
        <g class="logo__letter logo__letter--e" style="opacity: 1">
          <path
            class="logo__shape logo__shape--xy"
            d="M1483.31 0h95.98v316.592h-95.98V0Z"
            data-svg-origin="1531.300048828125 158.29600524902344"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--y"
            d="M1684 226.551v90.04h-200.68v-90.04H1684Z"
            data-svg-origin="1583.6600341796875 271.5709991455078"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
          <path
            class="logo__shape logo__shape--y"
            d="M1684 0v90.0399h-200.68V0H1684Z"
            data-svg-origin="1583.6600341796875 45.01995086669922"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          ></path>
        </g>
      </svg>
      <span class="preloader__r" style="opacity: 1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 86 86">
          <path
            d="M42.9 85.8085c-8.17 0-15.54-1.8242-22.1-5.4725-6.43-3.7942-11.53-8.9019-15.33-15.3229C1.82 58.4461 0 51.0765 0 42.9043c0-8.1723 1.82-15.5419 5.47-22.1089 3.8-6.5669 8.9-11.6746 15.33-15.323C27.36 1.8243 34.73 0 42.9 0c8.18 0 15.47 1.8242 21.89 5.4725 6.57 3.6483 11.68 8.756 15.33 15.3229 3.79 6.567 5.6901 13.9366 5.6901 22.1089 0 8.1722-1.9001 15.5418-5.6901 22.1088-3.65 6.421-8.76 11.5287-15.33 15.3229-6.42 3.6483-13.71 5.4725-21.89 5.4725Zm0-9.1938c9.49 0 17.3-3.1375 23.43-9.4126 6.13-6.4211 9.19-14.5204 9.19-24.2978 0-9.7776-3.06-17.8039-9.19-24.079-6.13-6.421-13.94-9.6315-23.43-9.6315-9.48 0-17.29 3.2105-23.42 9.6315-6.13 6.2751-9.19 14.3014-9.19 24.079 0 9.7774 3.06 17.8767 9.19 24.2978 6.13 6.2751 13.94 9.4126 23.42 9.4126ZM27.14 19.9198h19.27c5.1 0 9.12 1.2405 12.04 3.7213 2.91 2.4809 4.3699 5.7644 4.3699 9.8505 0 2.9186-.9399 5.4725-2.8399 7.6615-1.9 2.1889-4.31 3.6483-7.23 4.3779l10.73 19.2632h-11.6l-6.79-13.5718c-1.31-2.3349-3.06-3.5024-5.25-3.5024h-2.4099v17.0742H27.14V19.9198ZM45.53 39.183c2.04 0 3.65-.4378 4.82-1.3134 1.31-1.0216 1.9699-2.4079 1.9699-4.1591 0-1.6053-.6599-2.8457-1.9699-3.7213-1.17-1.0215-2.78-1.5323-4.82-1.5323h-8.32V39.183h8.32Z"
          ></path>
        </svg>
      </span>
    </div>
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
  background-color: red;
  mix-blend-mode: multiply;
  will-change: transform;
}

.logo-scroller {
  position: fixed;
  top: 0;
  left: 15px;
  display: flex;
  align-items: flex-end;
  width: calc(100% - 30px);
  height: 100svh;
  padding: 0 18px 18px;
  color: #e8e9ee;

  .logo-wrapper {
    position: relative;
    width: 100%;

    .preloader__r {
      position: absolute;
      right: 0;
      bottom: calc(100% + 0.81019vw);
      display: flex;
      height: 4.97685vw;
      width: 4.97685vw;
      clip-path: circle(50% at 50% 50%);
    }
  }
}

.is-intro-end {
  position: absolute !important;
  top: 100dvh;
  left: 0;
  width: 100%;
}
</style>
