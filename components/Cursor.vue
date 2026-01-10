<script setup lang="ts">
import gsap from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition } = storeToRefs(pageTransitionStore);

const isEntered = ref<any>(false);
const mousePosition = ref({ x: 0, y: 0 });
const cursorPosition = ref({ x: 0, y: 0 });
const cursorRef = ref<HTMLDivElement | null>(null);
const reqId = ref<number>(0);
const baseFreq = ref(0.01);
const filterScale = ref(0);
const current = ref<string | number>(-1);

const activeSrc = computed(() => usePublicAsset(`/images/skills/${current.value}.webp`));

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const handleMouseMove = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  mousePosition.value = { x: clientX, y: clientY };
};

function updateCursor(x: number, y: number) {
  gsap.set(cursorRef.value, { x, y, xPercent: -50, yPercent: -50 });

  const elementUnderCursor = document.elementFromPoint(x, y) as HTMLElement;
  isEntered.value = elementUnderCursor.dataset.detail;
  current.value = elementUnderCursor.dataset.experimentsIndex ?? -1;
}

function animate() {
  const { x: currentX, y: currentY } = cursorPosition.value;
  const { x: targetX, y: targetY } = mousePosition.value;

  cursorPosition.value = { x: lerp(currentX, targetX, 0.2), y: lerp(currentY, targetY, 0.2) };
  updateCursor(cursorPosition.value.x, cursorPosition.value.y);

  reqId.value = requestAnimationFrame(animate);
}

watch(current, (newVal) => {
  if (newVal !== -1) {
    // 이미지가 바뀔 때 순간적으로 왜곡되었다가 제자리로 돌아옴
    gsap.fromTo(
      filterScale,
      { value: 50 }, // 시작 왜곡 정도
      { value: 0, duration: 0.8, ease: "power2.out" } // 다시 원래대로
    );
  }
});

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
  animate();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
  cancelAnimationFrame(reqId.value);
});
</script>

<template>
  <div ref="cursorRef" :aria-hidden="true" class="cursor">
    <div :class="['cursor-label', isEntered && 'active']">
      <p :class="[+current > -1 && 'hidden']">Go into detail</p>

      <Transition name="fade">
        <div v-if="+current > -1 && !isPageTransition" class="distort" :aria-label="`${current}`">
          <svg viewBox="0 0 350 450">
            <filter id="distortionFilter">
              <feTurbulence
                type="turbulence"
                :baseFrequency="`0.07 ${baseFreq}`"
                numOctaves="5"
                seed="2"
                stitchTiles="stitch"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                :scale="filterScale"
                xChannelSelector="R"
                yChannelSelector="B"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                filterUnits="userSpaceOnUse"
              />
            </filter>
            <g filter="url(#distortionFilter)">
              <image class="distort__img" x="50" y="50" :xlink:href="activeSrc" height="350" width="250" />
            </g>
          </svg>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.cursor {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 400;
  pointer-events: none;

  @media (hover: hover) {
    display: block;
  }

  .cursor-label {
    position: absolute;
    top: 25%;
    left: calc(100% + 20px);

    opacity: 0;
    z-index: 1;

    transition: opacity 250ms ease-in-out;

    &.active {
      opacity: 1;
    }

    p {
      color: var(--white);
      font-size: 10px;
      line-height: 1;
      white-space: nowrap;

      &.hidden {
        opacity: 0;
      }
    }

    .distort {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 350px;
      transform: translate(-50%, -50%);

      pointer-events: none;
      user-select: none;
      cursor: none;
    }
  }
}
</style>
