<script setup lang="ts">
import gsap from "gsap";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

import Logo1 from "../logo/Logo1.vue";
import Logo2 from "../logo/Logo2.vue";
import Logo3 from "../logo/Logo3.vue";
import Logo4 from "../logo/Logo4.vue";
import Logo5 from "../logo/Logo5.vue";

const { viewRef } = defineProps<{ viewRef: HTMLElement | null }>();

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, test } = storeToRefs(scrollTriggerStore);

const introRef = ref<HTMLElement | null>(null);
const textWrapRef = ref<HTMLElement | null>(null);
const animatedIconsRef = ref<HTMLElement | null>(null);
const animatedTextRef = ref<HTMLElement | null>(null);
const iconElementsRefs = ref<HTMLElement[]>([]);
const textSegmentsRefs = ref<HTMLElement[]>([]);
const placeholderIconRefs = ref<HTMLElement[]>([]);
const duplicateIcons = ref<HTMLElement[]>([]);
const currentIconSize = ref<number>(0);
const exactScale = ref<number>(0);

const maskIndex = ref(0);

const textAnimationOrder = ref<{ segment: HTMLElement; originalIndex: number }[]>([]);
const isMobile = window.innerWidth <= 1000;
const headerIconSize = isMobile ? 30 : 70;

const setScrollTriggerUpdate = (self: any) => {
  if (!introRef.value || !animatedIconsRef.value || !viewRef || !animatedTextRef.value) return;

  const progress = self.progress;

  textSegmentsRefs.value.forEach((segment) => {
    gsap.set(segment, { opacity: 0 });
  });

  if (progress <= 0.3) {
    const movePrgress = progress / 0.3;
    const containerMoveY = -window.innerHeight * 0.3 * movePrgress;

    if (progress <= 0.15) {
      const heaederProgress = progress / 0.15;
      const headerMoveY = -50 * heaederProgress;
      const headerOpacity = 1 - heaederProgress;

      gsap.set(textWrapRef.value, {
        transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
        opacity: headerOpacity,
      });
    } else {
      gsap.set(textWrapRef.value, {
        transform: `translate(-50%, calc(-50% + -50px))`,
        opacity: 0,
        pointerEvents: "none",
      });
    }

    if (duplicateIcons.value.length) {
      duplicateIcons.value.forEach((duplicate) => {
        if (duplicate.parentNode) duplicate.parentNode.removeChild(duplicate);
      });

      duplicateIcons.value = [];
    }

    gsap.set(animatedIconsRef.value, {
      x: 0,
      y: containerMoveY,
      scale: 1,
      opacity: 1,
    });

    iconElementsRefs.value.forEach((icon, index) => {
      const staggerDelay = index * 0.1;
      const iconStart = staggerDelay;
      const iconEnd = staggerDelay + 0.5;

      const iconProgress = gsap.utils.mapRange(iconStart, iconEnd, 0, 1, movePrgress);
      const clampedProgress = Math.max(0, Math.min(1, iconProgress));
      const startOffset = -containerMoveY;
      const individualY = startOffset * (1 - clampedProgress);

      gsap.set(icon, {
        x: 0,
        y: individualY,
      });
    });
  } else if (progress <= 0.6) {
    const scalePrgoress = (progress - 0.3) / 0.3;

    if (scalePrgoress >= 0.5) introRef.value.style.backgroundColor = "#e3e3db";
    else introRef.value.style.backgroundColor = "#141414";

    if (duplicateIcons.value.length) {
      duplicateIcons.value.forEach((duplicate) => {
        if (duplicate.parentNode) duplicate.parentNode.removeChild(duplicate);
      });

      duplicateIcons.value = [];
    }

    const targetCenterY = window.innerHeight / 2;
    const targetCenterX = window.innerWidth / 2;
    const containerRect = animatedIconsRef.value.getBoundingClientRect();
    const currentCenterX = containerRect.left + containerRect.width / 2;
    const currentCenterY = containerRect.top + containerRect.height / 2;

    const deltaX = (targetCenterX - currentCenterX) * scalePrgoress;
    const deltaY = (targetCenterY - currentCenterY) * scalePrgoress;
    const baseY = -window.innerHeight * 0.3;
    const currentScale = 1 + (exactScale.value - 1) * scalePrgoress;

    gsap.set(animatedIconsRef.value, {
      x: deltaX,
      y: baseY + deltaY,
      scale: currentScale,
      opacity: 1,
    });
  } else if (progress <= 0.75) {
    const moveProgress = (progress - 0.6) / 0.15;

    gsap.set(animatedIconsRef.value, {
      scale: exactScale.value,
      opacity: 0,
    });

    if (!duplicateIcons.value.length) {
      duplicateIcons.value = [];

      iconElementsRefs.value.forEach((icon) => {
        const duplicate = icon.cloneNode(true) as HTMLElement;
        duplicate.classList.add("duplicate-icon");
        duplicate.style.position = "absolute";
        duplicate.style.width = `${headerIconSize}px`;
        duplicate.style.height = `${headerIconSize}px`;

        viewRef.appendChild(duplicate);
        duplicateIcons.value.push(duplicate);
      });
    }

    if (duplicateIcons.value.length) {
      duplicateIcons.value.forEach((duplicate, index) => {
        if (index < placeholderIconRefs.value.length) {
          const iconRect = iconElementsRefs.value[index].getBoundingClientRect();
          const startCenterX = iconRect.left + iconRect.width / 2;
          const startCenterY = iconRect.top + iconRect.height / 2;
          const startPageX = startCenterX + window.pageXOffset;
          const startPageY = startCenterY + window.pageYOffset;

          const targetRect = placeholderIconRefs.value[index].getBoundingClientRect();
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          const targetPageX = targetCenterX + window.pageXOffset;
          const targetPageY = targetCenterY + window.pageYOffset;

          const moveX = targetPageX - startPageX;
          const moveY = targetPageY - startPageY;

          let currentX = 0;
          let currentY = 0;

          if (moveProgress <= 0.5) {
            const verticalProgress = moveProgress / 0.5;
            currentY = moveY * verticalProgress;
          } else {
            const horizontalProgress = (moveProgress - 0.5) / 0.5;
            currentY = moveY;
            currentX = moveX * horizontalProgress;
          }

          const finalPageX = startPageX + currentX;
          const finalPageY = startPageY + currentY;

          duplicate.style.left = finalPageX - headerIconSize / 2 - 15 + "px";
          duplicate.style.top = finalPageY - headerIconSize / 2 - 15 + "px";
        }
      });
    }
  } else {
    textAnimationOrder.value.forEach((item, randomIndex) => {
      const segmentStart = 0.75 + randomIndex * 0.03;
      const segmentEnd = segmentStart + 0.015;
      const segemntProgress = gsap.utils.mapRange(segmentStart, segmentEnd, 0, 1, progress);
      const clampedProgress = Math.max(0, Math.min(1, segemntProgress));
      gsap.set(item.segment, {
        opacity: clampedProgress,
      });
    });
  }

  if (progress >= 0.75) {
    if (duplicateIcons.value.length) {
      duplicateIcons.value.forEach((duplicate, index) => {
        if (index < placeholderIconRefs.value.length) {
          const targetRect = placeholderIconRefs.value[index].getBoundingClientRect();
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          const targetPageX = targetCenterX + window.pageXOffset;
          const targetPageY = targetCenterY + window.pageYOffset;

          duplicate.style.left = targetPageX - headerIconSize / 2 - 15 + "px";
          duplicate.style.top = targetPageY - headerIconSize / 2 - 15 + "px";
        }
      });
    }
  }

  if (progress > 0.9) {
    const maskProgress = Math.floor(progress * 100 - 90);
    maskIndex.value = maskProgress;
  } else {
    maskIndex.value = 0;
  }

  if (maskIndex.value === 10) test.value = true;
  else test.value = false;
};

const setScrollTriggerEnter = () => {
  const textWrapTitle = textWrapRef.value?.querySelector(".title") as HTMLElement;
  const textWrapDesc = textWrapRef.value?.querySelector(".desc") as HTMLElement;

  gsap.set(textWrapTitle, { opacity: 0.2, translateY: 20 });
  gsap.to(textWrapTitle, {
    opacity: 1,
    translateY: 0,
    duration: 1.25,
    ease: "power3.inOut",
  });
  gsap.set(textWrapDesc, { opacity: 0, translateY: 30 });
  gsap.to(textWrapDesc, {
    opacity: 1,
    translateY: 0,
    duration: 1,
    delay: 0.2,
    ease: "power3.inOut",
  });

  const iconTransitionY = ["90%", "70%", "75%", "50%", "100%"];
  const iconDelay = [0.1, 0.05, 0, 0.08, 0.2];
  iconElementsRefs.value.forEach((icon, index) => {
    gsap.set(icon, { y: iconTransitionY[index] });
    gsap.to(icon, {
      y: 0,
      duration: 1.25,
      delay: iconDelay[index],
      ease: "power3.inOut",
    });
  });
};

const init = () => {
  if (!introRef.value) return;

  iconElementsRefs.value = Array.from(introRef.value?.querySelectorAll(".animated-icon"));
  textSegmentsRefs.value = Array.from(introRef.value?.querySelectorAll(".text-segment"));
  placeholderIconRefs.value = Array.from(introRef.value?.querySelectorAll(".placeholder-icon"));
  currentIconSize.value = iconElementsRefs.value[0].getBoundingClientRect().width;
  exactScale.value = headerIconSize / currentIconSize.value;

  textSegmentsRefs.value.forEach((segment, index) => {
    textAnimationOrder.value.push({ segment, originalIndex: index });
  });

  for (let i = textAnimationOrder.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [textAnimationOrder.value[i], textAnimationOrder.value[j]] = [
      textAnimationOrder.value[j],
      textAnimationOrder.value[i],
    ];
  }

  scrollTrigger.value?.create({
    trigger: ".intro",
    start: "top 15px",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    onEnter: setScrollTriggerEnter,
    onUpdate: (self) => setScrollTriggerUpdate(self),
  });
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div ref="introRef" class="intro" :style="{ '--mask-index': maskIndex }">
    <div ref="textWrapRef" class="text-wrap">
      <h2 class="title">PORTFOLIO</h2>
      <p class="desc">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ea. Et exercitationem nostrum accusamus magni
      </p>
    </div>

    <div ref="animatedIconsRef" class="animated-icons">
      <Logo1 class="animated-icon icon-1" />
      <Logo2 class="animated-icon icon-2" />
      <Logo3 class="animated-icon icon-3" />
      <Logo4 class="animated-icon icon-4" />
      <Logo5 class="animated-icon icon-5" />
    </div>

    <div ref="animatedTextRef" class="animated-text">
      <h3>
        <p>
          <span class="placeholder-icon" />
          <span class="text-segment">Delve into cooding</span>
          <span class="placeholder-icon" />
        </p>
        <p>
          <span class="text-segment">Without clutter.Unlock source code</span>
        </p>

        <p>
          <span class="text-segment">For every</span>
          <span class="placeholder-icon" />
          <span class="text-segment"> tutorial</span>
        </p>

        <p>
          <span class="placeholder-icon" />
          <span class="text-segment">Publishde on the Codegrid</span>
        </p>

        <p>
          <span class="placeholder-icon" />
          <span class="text-segment">Youtube channel.</span>
        </p>
      </h3>
    </div>
  </div>
</template>

<style scoped>
.intro {
  --mask-count: 8;

  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #141414;
  transition: background-color 0.3s ease;

  mask-image: url("/images/mask.webp");
  mask-position: calc(100% / (var(--mask-count, 1) - 1) * var(--mask-index, 0)) center;
  mask-size: calc(100vw * var(--mask-count, 8)) auto;
  mask-repeat: no-repeat;
  pointer-events: none;

  .text-wrap {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    text-align: center;
    display: flex;
    flex-direction: column;
    will-change: transform, opacity;

    .title {
      font-size: 7vw;
      font-weight: 700;
      letter-spacing: -2.5px;
      color: white;
    }

    .desc {
      font-size: 1.5rem;
      font-weight: 400;
      color: white;
    }
  }

  .animated-icons {
    position: fixed;
    inset: auto 16px 16px 16px;
    display: flex;
    align-items: center;
    will-change: transform;
    z-index: 2;

    .animated-icon {
      flex: 1;
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
      will-change: transform;
    }
  }

  .animated-text {
    pointer-events: none;

    h3 {
      position: relative;
      font-size: 62px;
      font-weight: 900;

      p {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        white-space: nowrap;

        .text-segment {
          color: var(--black);
          opacity: 0;
          line-height: 0.9;
        }

        .placeholder-icon {
          width: 70px;
          height: 70px;
          display: inline-block;
          will-change: transform;
          visibility: hidden;
        }
      }
    }
  }
}

@media (max-width: 1000px) {
  .intro {
    .text-wrap {
      top: 45%;
      width: 100%;

      .title {
        font-size: 12vw;
      }

      .desc {
        font-size: 1.1rem;
      }
    }

    .animated-text h3 {
      font-size: 4.5rem;

      p {
        margin-top: 4px;

        .placeholder-icon {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
