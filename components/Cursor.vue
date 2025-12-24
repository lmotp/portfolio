<script setup lang="ts">
import gsap from "gsap";

const isEntered = ref<any>(false);
const mousePosition = ref({ x: 0, y: 0 });
const cursorPosition = ref({ x: 0, y: 0 });
const cursorRef = ref<HTMLDivElement | null>(null);
const reqId = ref<number>(0);

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const handleMouseMove = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  mousePosition.value = { x: clientX, y: clientY };
};

function updateCursor(x: number, y: number) {
  gsap.set(cursorRef.value, { x, y, xPercent: -50, yPercent: -50 });

  const elementUnderCursor = document.elementFromPoint(x, y) as HTMLElement;
  isEntered.value = elementUnderCursor.dataset.detail;
}

function animate() {
  const { x: currentX, y: currentY } = cursorPosition.value;
  const { x: targetX, y: targetY } = mousePosition.value;

  cursorPosition.value = { x: lerp(currentX, targetX, 0.2), y: lerp(currentY, targetY, 0.2) };
  updateCursor(cursorPosition.value.x, cursorPosition.value.y);

  reqId.value = requestAnimationFrame(animate);
}

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
    <p :class="['cursor-label', isEntered && 'active']">Go into detail</p>
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
    color: #ff391e;
    font-size: 10px;
    line-height: 1;
    white-space: nowrap;
    opacity: 0;
    z-index: 1;

    transition: opacity 250ms ease-in-out;

    &.active {
      opacity: 1;
    }
  }
}
</style>
