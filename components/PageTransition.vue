<script setup lang="ts">
import { gsap } from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const router = useRouter();

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition, path } = storeToRefs(pageTransitionStore);

const overlayRef = ref<HTMLElement | null>(null);
const blocksRef = ref<HTMLElement[]>([]);
const BLOCK_COUNT = computed(() => (window.innerWidth <= 768 ? 10 : 20));

const coverPage = (url: string) => {
  if (isPageTransition.value) return;
  isPageTransition.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      router.push(url);
      setTimeout(revealPage, 500);
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
  gsap.fromTo(
    blocksRef.value,
    { scaleX: 1, transformOrigin: "right" },
    {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isPageTransition.value = false;
      },
    }
  );
};

watch(path, (url) => {
  coverPage(url);
});
</script>

<template>
  <div class="page-transition">
    <div ref="overlayRef" class="page-overlay">
      <div ref="blocksRef" v-for="n of BLOCK_COUNT" :key="n" class="block"></div>
    </div>
    <slot />
  </div>
</template>

<style>
.page-transition {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 101;

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
