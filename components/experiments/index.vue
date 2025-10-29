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
const spotlightBgImg = ref<HTMLElement | null>(null);

const imageElements = ref<Element[]>([]);
const currentActiveIndex = ref(0);

const config = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};
const containerWidth = window.innerWidth * 0.3;
const containerHeight = window.innerHeight;
const arcStartX = containerWidth - 220;
const arcStartY = -200;
const arcEndY = containerHeight + 200;
const arcControlPointX = arcStartX + config.arcRadius;
const arcControlPointY = containerHeight / 2;

const spotlightItems = [
  { name: "Burn", img: "/images/skills/0.webp", pixelImg: "/images/skills/0_pixel.png" },
  { name: "Glitch", img: "/images/skills/1.webp", pixelImg: "/images/skills/1_pixel.png" },
  { name: "Kuji", img: "/images/skills/2.webp", pixelImg: "/images/skills/2_pixel.png" },
  { name: "Roll", img: "/images/skills/3.webp", pixelImg: "/images/skills/3_pixel.png" },
  { name: "Pinball", img: "/images/skills/4.webp", pixelImg: "/images/skills/4_pixel.png" },
  { name: "Blur", img: "/images/skills/5.webp", pixelImg: "/images/skills/5_pixel.png" },
  { name: "Meteor", img: "/images/skills/6.webp", pixelImg: "/images/skills/6_pixel.png" },
  { name: "Step", img: "/images/skills/7.webp", pixelImg: "/images/skills/7_pixel.png" },
  { name: "Page", img: "/images/skills/8.webp", pixelImg: "/images/skills/8_pixel.png" },
  { name: "Card", img: "/images/skills/9.webp", pixelImg: "/images/skills/9_pixel.png" },
];

const init = () => {
  if (imagesContainer.value) imageElements.value = [...imagesContainer.value?.querySelectorAll(".spotlight-img")];
  const titleElements = titlesContainer.value?.querySelectorAll("strong");

  scrollTrigger.value?.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      const titlesContainerHeight = titlesContainer.value?.scrollHeight || 0;
      const startPosition = window.innerHeight;
      const targetPosition = -titlesContainerHeight;
      const totalDistance = startPosition - targetPosition;
      const currentY = startPosition / 2 - progress * totalDistance;

      gsap.set(".spotlight-titles", {
        transform: `translateY(${currentY}px)`,
      });

      imageElements.value.forEach((img, index) => {
        const imageProgress = getImageProgressState(index, progress + 0.13);
        const pos = getBezierPosition(imageProgress);

        gsap.set(img, { x: pos.x - 100, y: pos.y - 50 });
      });

      const viewportMiddle = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      titleElements?.forEach((title, index) => {
        const titleRect = title.getBoundingClientRect();
        const titleCenter = titleRect.top + titleRect.height / 2;
        const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);

        if (distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          closestIndex = index;
        }
      });

      if (titleElements) {
        if (titleElements[currentActiveIndex.value]) {
          titleElements[currentActiveIndex.value].style.color = "color-mix(in srgb, #fff, transparent 50%)";
        }

        titleElements[closestIndex].style.color = "#fff";
        currentActiveIndex.value = closestIndex;
      }
    },
  });
};

const getBezierPosition = (t: number) => {
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
  // if (lenisRef.value) lenisRef.value.options.infinite = true;

  nextTick(init);
});

onUnmounted(() => {
  if (lenisRef.value) lenisRef.value.options.infinite = false;
});
</script>

<template>
  <div class="spotlight">
    <div ref="spotlightBgImg" class="spotlight-bg-img">
      <img class="main-img" :src="spotlightItems[currentActiveIndex].img" alt="" />
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
    </div>
  </div>
</template>

<style>
.spotlight {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;

  .spotlight-bg-img {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-color: rgba(11, 13, 15, 0.5);
      backdrop-filter: blur(10px);
    }
  }

  .spotlight-titles-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 15vw;
    overflow: hidden;
    clip-path: polygon(50svh 0, 0 50%, 50svh 100%, 100% calc(100% + 100svh), 100% -100svh);

    &::after,
    &::before {
      content: "";
      position: absolute;
      width: 100svh;
      height: 1.5px;
      background-color: #fff;
      pointer-events: none;
      z-index: 10;
    }

    &::before {
      top: 0;
      left: 0;
      transform: rotate(-45deg) translate(-7rem);
    }

    &::after {
      bottom: 0;
      left: 0;
      transform: rotate(45deg) translate(-7rem);
    }

    .spotlight-titles {
      position: relative;
      left: 15%;
      display: flex;
      flex-direction: column;
      width: 75%;
      height: 100%;
      transform: translateY(100%);
      z-index: 2;

      strong {
        font-size: 58px;
        line-height: 2.25;
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
    left: 10%;
    margin-right: 1rem;
    z-index: 2;
    transform: translateY(-50%);

    p {
      font-weight: 500;
      color: #fff;
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
}
</style>
