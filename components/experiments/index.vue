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
  if (imagesContainer.value) imageElements.value = [...imagesContainer.value?.querySelectorAll(".spotlight-img")];

  const titleElements = titlesContainer.value?.querySelectorAll("h1");

  imageElements.value.forEach((img) => gsap.set(img, { opacity: 0 }));
  scrollTrigger.value?.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      const viewportHeight = window.innerHeight;
      const titlesContainerHeight = titlesContainer.value?.scrollHeight || 0;
      const startPosition = viewportHeight;
      const targetPosition = -titlesContainerHeight;
      const totalDistance = startPosition - targetPosition;
      const currentY = startPosition - progress * totalDistance;

      gsap.set(".spotlight-titles", {
        transform: `translateY(${currentY}px)`,
      });

      imageElements.value.forEach((img, index) => {
        const imageProgress = getImageProgressState(index, progress);
        if (imageProgress < 0 || imageProgress > 1) {
          gsap.set(img, { opacity: 0 });
        } else {
          const pos = getBezierPosition(imageProgress);
          gsap.set(img, {
            x: pos.x - 100,
            y: pos.y - 75,
            opacity: 1,
          });
        }
      });

      const viewportMiddle = viewportHeight / 2;
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

      if (closestIndex !== currentActiveIndex.value && titleElements) {
        if (titleElements[currentActiveIndex.value]) {
          titleElements[currentActiveIndex.value].style.opacity = "0.25";
        }

        titleElements[closestIndex].style.opacity = "1";
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
  if (lenisRef.value) lenisRef.value.options.infinite = true;

  nextTick(init);
});

onUnmounted(() => {
  if (lenisRef.value) lenisRef.value.options.infinite = false;
});
</script>

<template>
  <div class="spotlight">
    <div ref="spotlightBgImg" class="spotlight-bg-img">
      <img :src="spotlightItems[currentActiveIndex].img" alt="" />
    </div>

    <div ref="titlesContainerElement" class="spotlight-titles-container">
      <div ref="titlesContainer" class="spotlight-titles">
        <h1 v-for="item in spotlightItems" :key="item.name">{{ item.name }}</h1>
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
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  font-size: 4rem;
  font-weight: 500;
  line-height: 1;
}

p {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;
}

.spotlight {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;

  .spotlight-bg-img {
    position: absolute;
    inset: 0;
    overflow: hidden;

    /* img {
      transform: scale(1.5);
      will-change: transform;
    } */
  }

  .spotlight-titles-container {
    position: absolute;
    inset: 0 0 0 15vw;
    overflow: hidden;

    clip-path: polygon(50svh 0px, 0px 50%, 50svh 100%, 100% calc(100% + 100svh), 100% -100svh);

    &::after,
    &::before {
      content: "";
      position: absolute;
      width: 100svh;
      height: 2.5px;
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
      gap: 5rem;
      width: 75%;
      height: 100%;
      transform: translateY(100%);
      z-index: 2;

      h1 {
        color: #fff;
        opacity: 0.25;
        transition: opacity 0.3s ease;
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
    }
  }

  .spotlight-header {
    position: absolute;
    top: 50%;
    left: 10%;
    color: #fff;
    z-index: 2;
    transform: translateY(-50%);
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
