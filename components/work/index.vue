<script setup lang="ts">
import gsap from "gsap";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

import usePublicAsset from "~/composables/usePublicAsset";

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, lenisRef } = storeToRefs(scrollTriggerStore);

const titlesContainer = ref<HTMLElement | null>(null);
const imagesContainer = ref<HTMLElement | null>(null);
const spotlightHeader = ref<HTMLElement | null>(null);
const titlesContainerElement = ref<HTMLElement | null>(null);
const spotlightIntroTextWrapper = ref<HTMLElement | null>(null);
const spotlightBgImg = ref<HTMLElement | null>(null);
const introTextElements = ref<Element[] | null>(null);

const titleElements = ref<HTMLElement[]>([]);
const imageElements = ref<Element[]>([]);
const currentActiveIndex = ref(0);
const initProgress = ref(0);
const isInitEnd = ref(false);
const intialProgress = 0.195;

const config = {
  gap: 0.065,
  speed: 0.28,
  arcRadius: 500,
};

const introImage = "/images/works/intro-img.png";
const spotlightItems = [
  { name: "work-1", img: "/images/skills/0.webp" },
  { name: "work-2", img: "/images/skills/1.webp" },
  { name: "work-3", img: "/images/skills/2.webp" },
  { name: "work-4", img: "/images/skills/3.webp" },
  { name: "work-5", img: "/images/skills/4.webp" },
  { name: "work-6", img: "/images/skills/5.webp" },
  { name: "work-7", img: "/images/skills/6.webp" },
  { name: "work-8", img: "/images/skills/7.webp" },
  { name: "work-9", img: "/images/skills/8.webp" },
  { name: "work-10", img: "/images/skills/9.webp" },
];

const init = () => {
  window.scrollTo(0, 0);
  lenisRef.value?.stop();

  const introTl = gsap.timeline({
    onComplete: () => {
      lenisRef.value?.start();
      isInitEnd.value = true;
    },
  });

  if (imagesContainer.value) {
    imageElements.value = [...imagesContainer.value?.querySelectorAll(".spotlight-img")];
    imageElements.value.forEach((img) => gsap.set(img, { opacity: 0 }));
  }

  if (spotlightIntroTextWrapper.value) {
    introTextElements.value = [...spotlightIntroTextWrapper.value?.querySelectorAll(".spotlight-intro-text")];

    const moveDistance = window.innerWidth * 0.6;
    const scaleCase = [1.5, 1.25, 1, 0.75, 0.5, 0.25];
    introTl.add("start", 0.5);
    introTl.to(introTextElements.value[0], { duration: 1.1, x: -moveDistance }, "start");
    introTl.to(introTextElements.value[1], { duration: 1.1, x: moveDistance }, "start");
    introTl.fromTo(".spotlight-bg-img", { transform: "scale(0)" }, { transform: "scale(1)", duration: 1 }, "start");
    introTl.fromTo(".intro-img-bg", { transform: "scale(1.5)" }, { transform: "scale(1)", duration: 1 }, "start");
    introTl.fromTo(
      ".intro-img-item",
      { transform: (i) => `scale(${scaleCase[i]})` },
      { transform: "scale(1)", duration: 1 },
      "start"
    );

    introTl.to(initProgress, { duration: 1, value: 1, ease: "power2.inOut" }, ">");
  }

  if (titlesContainer.value) {
    titleElements.value = [...titlesContainer.value?.querySelectorAll("strong")];

    const titlesContainerHeight = titlesContainer.value?.scrollHeight || 0;
    const startPosition = window.innerHeight;
    const targetPosition = -titlesContainerHeight;
    const totalDistance = startPosition - targetPosition;
    const currentY = startPosition - intialProgress * totalDistance;

    gsap.set(titleElements.value[0], { color: "#fff" });

    introTl.add("image-in", ">=");
    introTl.to(".spotlight-titles", { duration: 1, y: currentY, ease: "power2.inOut" }, ">");
    imageElements.value.forEach((img, index) => {
      const imageProgress = getImageProgressState(index, 0.125);

      const pos = getBezierPosition(imageProgress);
      introTl.to(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 }, "image-in");
    });

    scrollTrigger.value?.create({
      trigger: ".spotlight",
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      scrub: 1,

      onUpdate: (self) => {
        scrollTriggerUpdate(self.progress + intialProgress, totalDistance, startPosition);
      },
    });

    const outroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".outro",
        start: `top+=${window.innerHeight * 3.5}px bottom`,
        end: `top+=${window.innerHeight * 3.5}px top`,
        scrub: 1,
      },
    });

    outroTl.add("outro", ">=");
    outroTl.to(".outro", { duration: 1, y: window.innerHeight * -1 }, "outro");
    outroTl.to(
      ".outro-box",
      { duration: 2.5, transform: "translateY(0)", left: "0%", right: "0%", top: "20%", ease: "power2.inOut" },
      "outro"
    );
  }
};

const scrollTriggerUpdate = (progress: number, totalDistance: number, startPosition: number) => {
  if (!isInitEnd.value || !titlesContainer.value) return;

  const y = startPosition - progress * totalDistance;
  gsap.set(".spotlight-titles", { y });

  imageElements.value.forEach((img, index) => {
    const imageProgress = getImageProgressState(index, progress - 0.07);

    const pos = getBezierPosition(imageProgress);
    gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
  });

  const viewportMiddle = window.innerHeight / 2;
  let closestIndex = 0;
  let closestDistance = Infinity;

  titleElements?.value.forEach((title, index) => {
    const titleRect = title.getBoundingClientRect();
    const titleCenter = titleRect.top + titleRect.height / 2;
    const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);

    if (distanceFromCenter < closestDistance) {
      closestDistance = distanceFromCenter;
      closestIndex = index;
    }
  });

  if (closestIndex !== currentActiveIndex.value) {
    if (titleElements.value[currentActiveIndex.value]) {
      titleElements.value[currentActiveIndex.value].style.color = "color-mix(in srgb, #fff, transparent 50%)";
    }

    titleElements.value[closestIndex].style.color = "#fff";
    currentActiveIndex.value = closestIndex;
  }
};

const getBezierPosition = (t: number) => {
  const containerWidth = window.innerWidth * 0.3;
  const containerHeight = window.innerHeight;

  const arcStartX = containerWidth - 220;
  const arcStartY = -200;
  const arcEndY = containerHeight + 200;

  const arcControlPointX = arcStartX + config.arcRadius;
  const arcControlPointY = containerHeight / 2;

  const x = (1 - t) * (1 - t) * arcStartX + 2 * (1 - t) * t * arcControlPointX + t * t * arcStartX;
  const y = (1 - t) * (1 - t) * arcStartY + 2 * (1 - t) * t * arcControlPointY + t * t * arcEndY;

  return { x, y };
};

const getImageProgressState = (index: number, overallProgress: number) => {
  const startTime = index * config.gap;
  const endTime = startTime + config.speed;

  if (overallProgress < startTime) return -1;
  if (overallProgress > endTime) return 2;

  return (overallProgress - startTime) / config.speed;
};

onMounted(() => {
  nextTick(init);
});

onUnmounted(() => {
  lenisRef.value?.start();
});
</script>

<template>
  <div class="spotlight wrapper" :style="{ '--p': initProgress }">
    <div ref="spotlightIntroTextWrapper" class="spotlight-intro-text-wrapper">
      <div class="spotlight-intro-text">
        <p>Beneath</p>
      </div>
      <div class="spotlight-intro-text">
        <p>Beyund</p>
      </div>
    </div>

    <div ref="spotlightBgImg" class="spotlight-bg-img">
      <div class="intro-img">
        <img class="intro-img-bg" :src="usePublicAsset(spotlightItems[currentActiveIndex].img)" alt="" />

        <template v-if="!isInitEnd">
          <img v-for="n of 6" :key="n" :src="usePublicAsset(introImage)" alt="" class="intro-img-item" />
        </template>
      </div>
    </div>

    <div ref="titlesContainerElement" class="spotlight-titles-container">
      <div ref="titlesContainer" class="spotlight-titles">
        <strong v-for="item in spotlightItems" :key="item.name">{{ item.name }}</strong>
      </div>
    </div>

    <div ref="imagesContainer" class="spotlight-images">
      <div v-for="item in spotlightItems" :key="item.name" class="spotlight-img">
        <img :src="usePublicAsset(item.img)" alt="" />
      </div>
    </div>

    <div ref="spotlightHeader" class="spotlight-header">
      <p>Discover</p>
      <div class="line top"></div>
      <div class="line bottom"></div>
    </div>
  </div>

  <div class="outro wrapper">
    <div class="outro-box">
      <h2>Momentes in still motion.</h2>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

.spotlight {
  position: relative;

  .spotlight-intro-text-wrapper {
    position: absolute;
    top: 50%;
    display: flex;
    gap: 0.5rem;
    width: 100%;
    transform: translateY(-50%);

    .spotlight-intro-text {
      position: relative;
      flex: 1;
      will-change: transform;

      &:nth-child(1) {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .spotlight-bg-img {
    position: absolute;
    inset: 0;
    overflow: hidden;

    .intro-img {
      position: absolute;
      inset: 0;
      overflow: hidden;
      isolation: isolate;
      will-change: transform;

      img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;

        &.intro-img-bg {
          z-index: -1;
        }
      }

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        opacity: var(--p);
        pointer-events: none;
        user-select: none;
      }
    }
  }

  .spotlight-titles-container {
    position: absolute;
    inset: 0 0 0 15vw;
    overflow: hidden;

    clip-path: polygon(50svh 0, 0 50%, 50svh 100%, 100% calc(100% + 100svh), 100% -100svh);

    .spotlight-titles {
      position: relative;
      left: 15%;
      display: flex;
      flex-direction: column;
      gap: 5rem;
      width: 75%;
      height: 100%;
      transform: translateY(100%);
      z-index: 2;

      strong {
        font-size: 58px;
        line-height: 1;
        color: color-mix(in srgb, #fff, transparent 50%);
        transition: color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    }
  }

  .spotlight-images {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    min-width: 300px;
    height: 100%;
    z-index: 1;
    pointer-events: none;

    .spotlight-img {
      position: absolute;
      width: 200px;
      height: 150px;
      will-change: transform;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .spotlight-header {
    position: absolute;
    top: 50%;
    left: 8.5%;
    color: #fff;
    transform: translateY(-50%);

    p {
      margin-right: 1rem;
      font-weight: 500;
      color: #fff;
      opacity: var(--p);
    }

    .line {
      position: absolute;
      top: 50%;
      left: 100%;
      width: 100lvh;
      height: 1.5px;
      transform-origin: 0 50%;

      &.top {
        transform: rotate(-45deg) translate(1rem);
      }
      &.bottom {
        transform: rotate(45deg) translate(1rem);
      }

      &::before {
        content: "";
        background-color: #fff;
        position: absolute;
        inset: 0;
        transform: scaleX(var(--p)) translateZ(0);
        transform-origin: 0 50%;
      }
    }
  }
}

.outro {
  position: fixed;
  top: 100%;
  background-color: black;
  z-index: 1;

  .outro-box {
    position: absolute;
    top: 40%;
    left: 10%;
    right: 10%;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background-color: red;
    border-radius: 1rem;
    transform: translateY(80%);
    transform-origin: bottom center;

    h2 {
      text-align: center;
      color: white;
    }
  }
}

@media (max-width: 1000px) {
  .spotlight {
    .spotlight-titles-container {
      clip-path: none;

      &::after,
      &::before {
        display: none;
      }

      .spotlight-titles {
        left: 0;
      }
    }

    .spotlight-header {
      display: none;
    }
  }

  .outro {
    padding: 2rem;
    text-align: center;
  }
}
</style>
