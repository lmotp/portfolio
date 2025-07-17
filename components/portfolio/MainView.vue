<script setup lang="ts">
import MainThreeScence from "./MainThreeScence.vue";
import MainPhysics from "./MainPhysics.vue";
import { ref, onMounted, onUnmounted } from "vue";

const scrollPercentage = ref(0);
const viewRef = ref<HTMLElement | null>(null);
const physicsCanvas = ref<HTMLCanvasElement | undefined>(undefined);
const isLoadng = ref(false);

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = viewRef.value!;
  const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollPercentage.value = percentage;
};

const handlePhysicsCanvas = (canvas: HTMLCanvasElement) => {
  physicsCanvas.value = canvas;
  isLoadng.value = true;
};

onMounted(() => {
  if (viewRef.value) viewRef.value.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  if (viewRef.value) viewRef.value.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div ref="viewRef" class="view" @scroll="handleScroll">
    <MainPhysics class="main-phy" :scrollPercentage="scrollPercentage" @physicsCanvas="handlePhysicsCanvas" />
    <MainThreeScence class="main-bg" :scrollPercentage="scrollPercentage" :physicsCanvas="physicsCanvas" />
  </div>
</template>

<style lang="scss" scoped>
.view {
  position: relative;
  width: 100%;
  height: 100%;
  isolation: isolate;

  .main-bg {
    position: absolute;
    inset: 0;
  }
  .main-phy {
    position: absolute;
    inset: 20px;
    z-index: -1;
  }
}
</style>
