<script setup lang="ts">
import { gsap } from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const router = useRouter();

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition, path } = storeToRefs(pageTransitionStore);

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

const coverPage = (url: string) => {
  if (isPageTransition.value) return;
  isPageTransition.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      router.push(url);
      setTimeout(() => {
        isCovering.value = true;
      }, 200);
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
      isPageTransition.value = false;
      isCovering.value = false;
    },
  });
};

watch(path, (url) => {
  createBlocks();
  coverPage(url);
});

watch(isCovering, (status) => {
  if (status) revealPage();
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
  z-index: 201;

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
