<script setup lang="ts">
import { gsap } from "gsap";

const overlayRef = ref<HTMLElement | null>(null);
const blocksRef = ref<HTMLElement[]>([]);
const isCovering = ref(false);
const BLOCK_COUNT = 20;

const createBlocks = () => {
  if (!overlayRef.value) return;

  overlayRef.value.innerHTML = "";
  blocksRef.value = [];

  for (let i = 0; i < BLOCK_COUNT; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    overlayRef.value.appendChild(block);
    blocksRef.value.push(block);
  }
};

const coverPage = () => {
  const tl = gsap.timeline({
    onComplete: () => {
      isCovering.value = true;
    },
  });

  tl.to(blocksRef.value, {
    scaleX: 1,
    duration: 0.4,
    stagger: 0.02,
    ease: "power2.out",
    transformOrigin: "left",
  });
};

const revealPage = () => {
  gsap.set(blocksRef.value, { scaleX: 1, transformOrigin: "right" });
  gsap.to(blocksRef.value, {
    scaleX: 0,
    duration: 0.4,
    stagger: 0.02,
    ease: "power2.out",
    transformOrigin: "right",
    onComplete: () => {
      isCovering.value = false;
    },
  });
};

watch(isCovering, (status) => {
  if (status) revealPage();
});

onMounted(() => {
  createBlocks();
  coverPage();
});
</script>

<template>
  <div class="page-transition">
    <div ref="overlayRef" class="page-overlay"></div>
    <slot />
  </div>
</template>

<style>
.page-transition {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;

  .page-overlay {
    display: flex;
    width: 100%;
    height: 100%;

    .block {
      flex: 1;
      height: 100%;
      background-color: #222;
      transform: scaleX(0);
      transform-origin: left;
    }
  }
}
</style>
