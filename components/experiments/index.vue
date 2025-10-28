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
  if (!spotlightIntroTextWrapper.value) return;

  introTextElements.value = [...spotlightIntroTextWrapper.value?.querySelectorAll(".spotlight-intro-text")];

  spotlightItems.forEach((item, index) => {
    const titleElement = document.createElement("h1");
    titleElement.textContent = item.name;

    if (index === 0) titleElement.style.opacity = "1";
    titlesContainer.value?.appendChild(titleElement);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "spotlight-img";

    const imgElement = document.createElement("img");
    imgElement.src = item.img;
    imgElement.alt = "";
    imgWrapper.appendChild(imgElement);
    imagesContainer.value?.appendChild(imgWrapper);
    imageElements.value.push(imgWrapper);
  });

  const titleElements = titlesContainer.value?.querySelectorAll("h1");

  imageElements.value.forEach((img) => gsap.set(img, { opacity: 0 }));
  scrollTrigger.value?.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 10}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      if (!introTextElements.value) return;

      const progress = self.progress;

      if (progress <= 0.2) {
        const animationProgress = progress / 0.2;
        const moveDistance = window.innerWidth * 0.6;

        gsap.set(introTextElements.value[0], {
          x: -animationProgress * moveDistance,
        });
        gsap.set(introTextElements.value[1], {
          x: animationProgress * moveDistance,
        });

        gsap.set(introTextElements.value[0], { opacity: 1 });
        gsap.set(introTextElements.value[1], { opacity: 1 });

        gsap.set(".spotlight-bg-img", {
          transform: `scale(${animationProgress})`,
        });
        gsap.set(".spotlight-bg-img img", {
          transform: `scale(${1.5 - animationProgress * 0.5})`,
        });

        imageElements.value.forEach((img) => gsap.set(img, { opacity: 0 }));
        if (spotlightHeader.value) spotlightHeader.value.style.opacity = "0";
        gsap.set(titlesContainerElement.value, {
          "--before-opacity": 0,
          "--after-opacity": 0,
        });
      } else if (progress > 0.2 && progress <= 0.25) {
        gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
        gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

        gsap.set(introTextElements.value[0], { opacity: 0 });
        gsap.set(introTextElements.value[1], { opacity: 0 });

        imageElements.value.forEach((img) => gsap.set(img, { opacity: 0 }));
        if (spotlightHeader.value) spotlightHeader.value.style.opacity = "1";
        gsap.set(titlesContainerElement.value, {
          "--before-opacity": 1,
          "--after-opacity": 1,
        });
      } else if (progress > 0.25 && progress <= 0.95) {
        gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
        gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

        gsap.set(introTextElements.value[0], { opacity: 0 });
        gsap.set(introTextElements.value[1], { opacity: 0 });

        if (spotlightHeader.value) spotlightHeader.value.style.opacity = "1";
        gsap.set(titlesContainerElement.value, {
          "--before-opacity": 1,
          "--after-opacity": 1,
        });

        const switchProgress = (progress - 0.25) / 0.7;
        const viewportHeight = window.innerHeight;
        const titlesContainerHeight = titlesContainer.value?.scrollHeight || 0;
        const startPosition = viewportHeight;
        const targetPosition = -titlesContainerHeight;
        const totalDistance = startPosition - targetPosition;
        const currentY = startPosition - switchProgress * totalDistance;

        gsap.set(".spotlight-titles", {
          transform: `translateY(${currentY}px)`,
        });

        imageElements.value.forEach((img, index) => {
          const imageProgress = getImageProgressState(index, switchProgress);
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
      } else if (progress > 0.95) {
        if (spotlightHeader.value) spotlightHeader.value.style.opacity = "0";
        gsap.set(titlesContainerElement.value, {
          "--before-opacity": 0,
          "--after-opacity": 0,
        });
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
  nextTick(init);
});
</script>

<template>
  <div class="intro wrapper">
    <h1>A curated series of surreal frames.</h1>
  </div>

  <div class="spotlight wrapper">
    <div ref="spotlightIntroTextWrapper" class="spotlight-intro-text-wrapper">
      <div class="spotlight-intro-text">
        <p>Beneath</p>
      </div>
      <div class="spotlight-intro-text">
        <p>Beyund</p>
      </div>
    </div>

    <div ref="spotlightBgImg" class="spotlight-bg-img">
      <img :src="spotlightItems[currentActiveIndex].img" alt="" />
    </div>

    <div ref="titlesContainerElement" class="spotlight-titles-container">
      <div ref="titlesContainer" class="spotlight-titles"></div>
    </div>

    <div ref="imagesContainer" class="spotlight-images"></div>

    <div ref="spotlightHeader" class="spotlight-header">
      <p>Discover</p>
    </div>
  </div>

  <div class="outro wrapper">
    <h1>Momentes in still motion.</h1>
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

.wrapper {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

.intro,
.outro {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: black;
  color: white;
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
    transform: scale(0);
    will-change: transform;

    img {
      transform: scale(1.5);
      will-change: transform;
    }
  }

  .spotlight-titles-container {
    --before-opacity: 0;
    --after-opacity: 0;

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
      transition: opacity 0.3s ease;
      z-index: 10;
    }

    &::before {
      top: 0;
      left: 0;
      transform: rotate(-45deg) translate(-7rem);
      opacity: var(--before-opacity);
    }

    &::after {
      bottom: 0;
      left: 0;
      transform: rotate(45deg) translate(-7rem);
      opacity: var(--after-opacity);
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
    opacity: 0;
    z-index: 2;
    transform: translateY(-50%);
    transition: opacity 0.3s ease;
  }
}

.is-cloes {
  .intro,
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
