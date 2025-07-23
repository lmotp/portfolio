<script setup lang="ts">
import ThreeScence from "./ThreeScence.vue";
import Physics from "./Physics.vue";

const scrollPercentage = ref(0);
const viewRef = ref<HTMLElement | null>(null);
const initPhysicsObj = ref<InitPhysicsObj | null>(null);

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = viewRef.value!;
  const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollPercentage.value = percentage;
};

const initPhysics = (data: InitPhysicsObj) => {
  initPhysicsObj.value = data;
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
    <Physics class="main-phy" :scrollPercentage="scrollPercentage" @initPhysics="initPhysics" />
    <ThreeScence class="main-bg" :scrollPercentage="scrollPercentage" :initPhysicsObj="initPhysicsObj" />
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
    inset: 0;
    z-index: -1;
  }
}
</style>
