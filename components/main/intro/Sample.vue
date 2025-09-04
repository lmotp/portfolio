<script setup lang="ts">
import Logo1 from "../logo/Logo1.vue";
import Logo2 from "../logo/Logo2.vue";
import Logo3 from "../logo/Logo3.vue";
import Logo4 from "../logo/Logo4.vue";
import Logo5 from "../logo/Logo5.vue";

import gsap from "gsap";

const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const heroIconsRef = ref<HTMLElement | null>(null);
const introContainerRef = ref<HTMLElement | null>(null);

const heroInit = () => {
  if (!heroIconsRef.value) return;

  const heroIconsSize = heroIconsRef.value?.getBoundingClientRect();
  const heroCenter = -heroIconsSize?.top + window.innerHeight / 2 - heroIconsSize?.height / 2;
  const heroIcons = [...heroIconsRef.value.querySelectorAll(".hero-icon")];

  const tl = gsap.timeline({
    scrollTrigger: {
      id: "section-heading",
      trigger: ".hero-trigger",
      start: "top top",
      end: "bottom top",
      scrub: !0,
    },
    defaults: {
      overwrite: "auto",
    },
  });

  tl.add("start");
  tl.set(heroIconsRef.value, { y: 0, immediateRender: false });

  if (isMobile.value) {
  } else {
    tl.to(".hero-text", { y: -50, opacity: 0 }, "start");
    tl.fromTo(
      heroIcons,
      {
        y: 0,
      },
      {
        y: heroCenter,
        stagger: 0.1,
        immediateRender: false,
      },
      "start"
    );
    tl.add("out", "-=0.2");
    tl.to(
      ".hero-container .scale",
      {
        scale: 8.3 / 30,
      },
      "out"
    );
    tl.to(
      ".hero-bg",
      {
        opacity: 0,
        duration: 1e-4,
      },
      "out+=0.3"
    );
  }
};
const introInit = () => {
  if (!introContainerRef.value) return;

  const lineTexts = [...introContainerRef.value.querySelectorAll(".line span")];
  const icons = [...introContainerRef.value.querySelectorAll(".intro-main-icon .intro-icon")];
  const dumyIcons = [...introContainerRef.value.querySelectorAll(".intro-dumy-icon .intro-icon")];

  gsap.set(".intro-container", { opacity: 0 });
  gsap.set(lineTexts, { opacity: 0 });
  gsap.set(icons, { x: 0, y: 0 });

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    const dumy = dumyIcons[i];
    const iconRect = icon.getBoundingClientRect();
    const dumyRect = dumy.getBoundingClientRect();
    const x = dumyRect.left - iconRect.left;
    const y = dumyRect.top - iconRect.top;

    gsap.set(icon, { x, y });

    console.log(dumyRect.left, iconRect.left, 1);
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      id: "section-intro",
      trigger: ".intro-trigger",
      start: "top 15px",
      end: "bottom bottom",
      scrub: !0,
    },
    defaults: {
      overwrite: "auto",
    },
  });

  if (isMobile.value) {
    tl.add("start");
  } else {
    tl.add("start");
    tl.to(".intro-container", { opacity: 1, duration: 1e-4 }, "start");

    tl.add("song", "start");
    tl.to(".intro-icon.icon-1", { y: 0, duration: 0.3, ease: "power2.out" }, "song");

    tl.add("song2");
    tl.to(".intro-icon.icon-1", { x: 0 }, "song2");

    tl.fromTo(".line-1 span:last-child", { x: -50 }, { x: 0 }, "song2+=0.1");
    tl.set(".line-1 span:last-child", { opacity: 1 }, "song2+=0.2");
    tl.fromTo(".line-1 span:first-child", { x: -50 }, { x: 0 }, "song2+=0.3");
    tl.set(".line-1 span:first-child", { opacity: 1 }, "song2+=0.4");

    tl.add("watch", "song2+=0.5");
    tl.to(".intro-icon.icon-2", { x: 0, duration: 0.5, ease: "power1.inOut" }, "song2");
    tl.fromTo(".line-2 span:first-child", { x: -50 }, { x: 0 }, "song2+=0.2");
    tl.set(".line-2 span:first-child", { opacity: 1 }, "song2+=0.3");
    tl.fromTo(".line-2 span:last-child", { x: 50 }, { x: 0 }, "song2+=0.4");
    tl.set(".line-2 span:last-child", { opacity: 1 }, "song2+=0.5");

    tl.add("game", "song2+=0.3");

    const g = introContainerRef.value.querySelector(".intro-icon.icon-2");
    const m = gsap.getProperty(g, "y");

    tl.to(".intro-icon.icon-3", { y: 0, duration: 0.3, ease: "power2.out" }, "song2");
    tl.to(".intro-icon.icon-3", { x: 0, duration: 0.5, ease: "power1.inOut" }, "game");
    tl.fromTo(".line-3 span:first-child", { x: -50 }, { x: 0 }, "game+=0.2");
    tl.set(".line-3 span:first-child", { opacity: 1 }, "game+=0.3");
    tl.fromTo(".line-3 span:last-child", { x: 50 }, { x: 0 }, "game+=0.4");
    tl.set(".line-3 span:last-child", { opacity: 1 }, "game+=0.5");

    tl.add("shop", "song2+=0.4");
    tl.to(".intro-icon.icon-4", { y: `-=${m}`, duration: 0.3, ease: "power2.out" }, "song2+=0.3");
    tl.to(".intro-icon.icon-4", { y: 0, duration: 0.3, ease: "power2.out" }, "song2+=0.3");

    tl.to(".intro-icon.icon-5", { y: 0, duration: 0.3, ease: "power2.out" }, "song2+=0.3");
    tl.to(".intro-icon.icon-4", { x: 0, duration: 0.5, ease: "power1.inOut" }, "shop");
    tl.to(".intro-icon.icon-5", { x: 0, duration: 0.5, ease: "power1.inOut" }, "shop");
    tl.fromTo(".line-4 span:last-child", { x: -50 }, { x: 0 }, "shop+=0.2");
    tl.set(".line-4 span:last-child", { opacity: 1 }, "shop+=0.3");
    tl.fromTo(".line-4 span:first-child", { x: -50 }, { x: 0 }, "shop+=0.4");
    tl.set(".line-4 span:first-child", { opacity: 1 }, "shop+=0.5");
  }
};

onMounted(() => {
  nextTick(() => {
    introInit();
    heroInit();
  });
});
</script>

<template>
  <div class="hero-container">
    <div class="hero-trigger"></div>
    <div class="hero-bg"></div>
    <div class="hero-sticky">
      <div class="scale">
        <div class="hero-text">
          <h2 class="title">
            <span>Your data runs the</span>
            <span>world</span>
          </h2>
          <p class="desc">Start earning from it today.</p>
        </div>
        <div ref="heroIconsRef" class="hero-icons">
          <Logo1 class="hero-icon icon-1" />
          <Logo2 class="hero-icon icon-2" />
          <Logo3 class="hero-icon icon-3" />
          <Logo4 class="hero-icon icon-4" />
          <Logo5 class="hero-icon icon-5" />
        </div>
      </div>
    </div>
  </div>

  <div ref="introContainerRef" class="intro-container">
    <div class="intro-bg"></div>
    <div class="intro-trigger"></div>
    <div class="intro-sticky">
      <h3 class="intro-main-icon title">
        <p class="line line-1">
          <span>Your favorite</span>
          <Logo5 class="intro-icon icon-1" />
          <span>songs</span>
        </p>

        <p class="line line-2">
          <span>That</span>
          <Logo1 class="intro-icon icon-2" />
          <span>must-see movie.</span>
        </p>

        <p class="line line-3">
          <span>Your top</span>
          <Logo4 class="intro-icon icon-3" />
          <span>interests and</span>
        </p>
        <p class="line line-4">
          <span>all your shopping</span>
          <Logo2 class="intro-icon icon-4" />
          <Logo3 class="intro-icon icon-5" />
          <span>habits.</span>
        </p>
      </h3>

      <div class="intro-dumy-icon" :aria-hidden="true">
        <Logo5 class="intro-icon icon-1" />
        <Logo1 class="intro-icon icon-2" />
        <Logo4 class="intro-icon icon-3" />
        <Logo2 class="intro-icon icon-4" />
        <Logo3 class="intro-icon icon-5" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: 300svh;
  background-color: #e3e3db;

  .hero-trigger {
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 100svh;
    opacity: 0;
  }

  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #141414;
    will-change: opacity;
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    width: 100%;
    height: calc(100svh - 30px);
    text-align: center;
    overflow: hidden;

    .scale {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: white;

      will-change: transform;

      .hero-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        gap: 42px;

        .title {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 0.95;
          font-size: 100px;
          font-weight: 700;

          @media (max-width: 1000px) {
            font-size: 45px;
          }
        }

        .desc {
          font-size: 14px;
          line-height: 1.2;

          @media (max-width: 1000px) {
            font-size: 12px;
          }
        }
      }

      .hero-icons {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px 14px;
        width: 100%;

        .hero-icon {
          flex: 1;
          width: 100%;
          height: 100%;
          aspect-ratio: 1;
          will-change: transform;
        }
      }
    }
  }
}

.intro-container {
  position: relative;
  margin-top: -200svh;
  width: 100%;
  height: 300svh;

  .intro-trigger {
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 200svh;
    opacity: 0;
  }

  .intro-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e3e3db;
  }

  .intro-sticky {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100svh;
    text-align: center;
    overflow: hidden;

    .intro-main-icon {
      position: relative;
      line-height: 1.2;
      font-size: 82px;
      font-weight: 700;
      pointer-events: none;

      @media (max-width: 1000px) {
        font-size: 40px;
      }

      .line {
        position: relative;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        white-space: nowrap;
        will-change: transform;

        &.line-1 {
          position: absolute;
          bottom: 100%;
        }

        &.line-3 {
          position: absolute;
          top: 100%;
        }
        &.line-4 {
          position: absolute;
          top: 200%;
        }

        .intro-icon {
          margin-inline: 18px;

          &.icon-4 {
            margin-right: 4px;
          }
          &.icon-5 {
            margin-left: 0;
          }
        }
      }
    }

    .intro-dumy-icon {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 34px);
      /* pointer-events: none; */
      opacity: 0;

      .intro-icon {
        &.icon-1 {
          order: 5;
        }
        &.icon-2 {
          order: 1;
        }
        &.icon-3 {
          order: 4;
        }
        &.icon-4 {
          order: 2;
        }
        &.icon-5 {
          order: 3;
        }
      }
    }

    .intro-icon {
      width: 74px;
      height: 74px;
      min-width: 74px;
      min-height: 74px;

      &.icon-3 {
        width: 86px;
        min-width: 86px;
      }
    }
  }
}
</style>
