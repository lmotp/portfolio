<script setup lang="ts">
import { gsap } from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition, path, isPopState, isDisabled, downloadPercent } = storeToRefs(pageTransitionStore);

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, lenisRef } = storeToRefs(scrollTriggerStore);

const isCovered = ref(false);
const blocksRef = ref<HTMLElement[]>([]);
const BLOCK_COUNT = computed(() => (window.innerWidth <= 768 ? 10 : 20));

const coverPage = (url: string) => {
  if (isPageTransition.value) return;
  isPageTransition.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      isCovered.value = true;
      router.push(url);
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
        downloadPercent.value = 0;
        isPageTransition.value = false;
        if (lenisRef.value) lenisRef.value.resize();
        if (scrollTrigger.value) scrollTrigger.value.refresh();
      },
    },
  );
};

watch(path, (url) => {
  if (!url) return;

  if (isDisabled.value) {
    isDisabled.value = false;
    return router.push(url);
  }

  if (route.path === "/" && (url === "/archives" || url === "/experiments" || url === "/")) {
    return;
  } else if (route.path.split("/").length === 3 && (url === "/archives" || url === "/experiments")) {
    coverPage("/");
  } else {
    coverPage(url!);
  }
});

watch(downloadPercent, (val) => {
  if (val >= 100) {
    setTimeout(() => {
      isCovered.value = false;
      setTimeout(revealPage, 500);
    }, 500);
  }
});
</script>

<template>
  <div class="page-transition">
    <div class="page-overlay">
      <transition name="fade">
        <strong v-if="isCovered" :class="['percent']">{{ downloadPercent }}% </strong>
      </transition>
      <div ref="blocksRef" v-for="n of BLOCK_COUNT" :key="n" :class="['block']"></div>
    </div>
    <slot />
  </div>
</template>

<style>
.page-transition {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 200;

  .page-overlay {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    isolation: isolate;

    .percent {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      font-weight: bold;
      color: var(--white);
      z-index: 1;
    }

    .block {
      flex: 1;
      min-width: 0;
      position: relative;
      height: 100%;
      background-color: var(--black);
      transform: scaleX(0);
      transform-origin: left;
    }
  }
}
</style>
