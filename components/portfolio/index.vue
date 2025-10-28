<script setup lang="ts">
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";
import gsap from "gsap";

import PortfolioLayerCard from "./PortfolioLayerCard.vue";
import layerCards from "./card.json";

const layerCardWrapRef = ref<HTMLElement | null>(null);
const sectionRef = ref<HTMLElement | null>(null);

const SCROLL_TO_ANGLE_FACTOR = 0.001;

const scrollTriggerStore = useScrollTriggerStore();
const { lenisRef } = storeToRefs(scrollTriggerStore);

const viewHeight = computed(() => {
  const scrollAmount = (Math.PI * 2) / SCROLL_TO_ANGLE_FACTOR;
  const vh = (scrollAmount / window.innerHeight) * 100 + 100;

  return vh;
});
const cards = computed(() => {
  const values = Object.values(layerCards);
  const repetitionCount = 6;
  let currentId = 1;

  const repeatedData = Array(repetitionCount)
    .fill(0)
    .flatMap(() => {
      return values.map((item) => {
        return {
          ...item,
          id: currentId++,
        };
      });
    });

  return repeatedData;
});

const updatePosition = (e?: Event) => {
  if (!layerCardWrapRef?.value || !sectionRef?.value) return;

  const scrollAmount = window.scrollY * SCROLL_TO_ANGLE_FACTOR * -1;
  const items = layerCardWrapRef.value?.querySelectorAll(".layer-card");
  const angleIncrement = (Math.PI * 2) / cards.value.length;
  const radius = 1100;

  items?.forEach((item, index) => {
    const angle = index * angleIncrement + scrollAmount;
    const x = window.innerWidth / 2 + radius * Math.cos(angle);
    const y = window.innerHeight / 2 + radius * Math.sin(angle);
    const rotation = (angle * 180) / Math.PI;

    gsap.to(item, {
      duration: 0.05,
      x,
      y,
      rotation,
      ease: "elastic.out(1, 0.3)",
    });
  });
};

onMounted(() => {
  if (lenisRef.value) lenisRef.value.options.infinite = true;

  updatePosition();
  window.addEventListener("scroll", updatePosition);
});

onUnmounted(() => {
  if (lenisRef.value) lenisRef.value.options.infinite = false;
  window.removeEventListener("scroll", updatePosition);
});
</script>

<template>
  <section ref="sectionRef" :style="{ height: `${viewHeight}dvh ` }">
    <div ref="layerCardWrapRef" class="layer-card-wrap">
      <PortfolioLayerCard
        v-for="(card, index) in cards"
        :key="index"
        v-bind="card"
        :totalAngle="(Math.PI * 2) / cards.length"
      />
    </div>
  </section>
</template>

<style scoped>
section {
  position: relative;
  width: 100%;
  background-color: black;

  .layer-card-wrap {
    position: fixed;
    top: 0;
    left: -75%;
    width: 200%;
    height: 100%;
  }
}
</style>
