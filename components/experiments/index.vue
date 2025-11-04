<script setup lang="ts">
import gsap from "gsap";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, lenisRef } = storeToRefs(scrollTriggerStore);

const titlesContainer = ref<HTMLElement | null>(null);
const imagesContainer = ref<HTMLElement | null>(null);
const spotlightHeader = ref<HTMLElement | null>(null);
const titlesContainerElement = ref<HTMLElement | null>(null);
const spotlightIntroTextWrapper = ref<HTMLElement | null>(null);
const spotlightBgImg = ref<HTMLElement | null>(null);
const introTextElements = ref<Element[] | null>(null);

const imageElements = ref<Element[]>([]);
const currentActiveIndex = ref(0);
const initProgress = ref(0);
const isInitEnd = ref(false);

const config = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};

const introImage = "/images/experiments/intro-img.png";
const spotlightItems = [
  { name: "Burn", img: "/images/skills/0.webp" },
  { name: "Glitch", img: "/images/skills/1.webp" },
  { name: "Kuji", img: "/images/skills/2.webp" },
  { name: "Roll", img: "/images/skills/3.webp" },
  { name: "Pinball", img: "/images/skills/4.webp" },
  { name: "Blur", img: "/images/skills/5.webp" },
  { name: "Meteor", img: "/images/skills/6.webp" },
  { name: "Step", img: "/images/skills/7.webp" },
  { name: "Page", img: "/images/skills/8.webp" },
  { name: "Card", img: "/images/skills/9.webp" },
];

const init = () => {
  window.scrollTo(0, 0);
  lenisRef.value?.stop();

  if (imagesContainer.value) {
    imageElements.value = [...imagesContainer.value?.querySelectorAll(".spotlight-img")];
    imageElements.value.forEach((img) => gsap.set(img, { opacity: 0 }));
  }

  if (spotlightIntroTextWrapper.value) {
    introTextElements.value = [...spotlightIntroTextWrapper.value?.querySelectorAll(".spotlight-intro-text")];

    const introTl = gsap.timeline({
      onComplete: () => {
        lenisRef.value?.start();
        isInitEnd.value = true;
      },
    });
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

  scrollTrigger.value?.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,

    onUpdate: (self) => {
      scrollTriggerUpdate(self.progress);
    },
  });
};

const scrollTriggerUpdate = (progress: number) => {
  if (!isInitEnd.value) return;

  itemScrollTriggerUpdate(progress);

  const titleElements = titlesContainer.value?.querySelectorAll("strong");
  const viewportMiddle = window.innerHeight / 2;
  let closestIndex = 0;
  let closestDistance = Infinity;

  if (titleElements) {
    titleElements?.forEach((title, index) => {
      const titleRect = title.getBoundingClientRect();
      const titleCenter = titleRect.top + titleRect.height / 2;
      const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);

      if (distanceFromCenter < closestDistance) {
        closestDistance = distanceFromCenter;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentActiveIndex.value) {
      if (titleElements[currentActiveIndex.value]) {
        titleElements[currentActiveIndex.value].style.color = "color-mix(in srgb, #fff, transparent 50%)";
      }

      titleElements[closestIndex].style.color = "#fff";
      currentActiveIndex.value = closestIndex;
    } else {
      titleElements[closestIndex].style.color = "#fff";
    }
  }
};

const itemScrollTriggerUpdate = (progress: number) => {
  const switchProgress = progress;
  const titlesContainerHeight = titlesContainer.value?.scrollHeight || 0;
  const startPosition = window.innerHeight;
  const targetPosition = -titlesContainerHeight;
  const totalDistance = startPosition - targetPosition;
  const currentY = startPosition - switchProgress * totalDistance;

  gsap.set(".spotlight-titles", {
    transform: `translateY(${currentY}px)`,
  });

  imageElements.value.forEach((img, index) => {
    const imageProgress = getImageProgressState(index, switchProgress);
    if (imageProgress < 0 || imageProgress > 1) gsap.set(img, { opacity: 0 });
    else {
      const pos = getBezierPosition(imageProgress);
      gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
    }
  });
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
        <img class="intro-img-bg" :src="spotlightItems[currentActiveIndex].img" alt="" />

        <template v-if="!isInitEnd">
          <img v-for="n of 6" :key="n" :src="introImage" alt="" class="intro-img-item" />
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
        <img :src="item.img" alt="" />
      </div>
    </div>

    <div ref="spotlightHeader" class="spotlight-header">
      <p>Discover</p>
      <div class="line top"></div>
      <div class="line bottom"></div>
    </div>
  </div>

  <div class="outro wrapper">
    <h1>Momentes in still motion.</h1>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

.outro {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: black;
}

.spotlight {
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

@media (max-width: 1000px) {
  .outro {
    padding: 2rem;
    text-align: center;
  }

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
}
</style>
