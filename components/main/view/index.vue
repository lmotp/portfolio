<script setup lang="ts">
import ThreeScence from "./ThreeScence.vue";
import Physics from "./Physics.vue";
import SpeedLine from "./SpeedLine.vue";
import { usePhysicsStore } from "@/stores/physics";
import { storeToRefs } from "pinia";

const scrollPercentage = ref(0);
const viewRef = ref<HTMLElement | null>(null);
const downBtnRef = ref<HTMLButtonElement | null>(null);

const physicsStore = usePhysicsStore();
const { isDownBtnShow, isSuccess, isPress, isShowThree } = storeToRefs(physicsStore);

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = viewRef.value!;
  const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollPercentage.value = percentage;
};

const buttonInit = () => {
  const button = downBtnRef.value;
  const downEvent = ["mousedown", "touchstart"];
  const upEvent = ["mouseup", "touchend"];
  let timeout: NodeJS.Timeout;
  button!.style.setProperty("--duration", physicsStore.PRESS_TIME + "ms");

  downEvent.forEach((e) => {
    button!.addEventListener(e, () => {
      if (!isPress.value) {
        isPress.value = true;
        timeout = setTimeout(() => {
          isSuccess.value = true;
          isDownBtnShow.value = false;
        }, physicsStore.PRESS_TIME);
      }
    });
  });

  upEvent.forEach((e) => {
    button!.addEventListener(e, () => {
      isPress.value = false;
      clearTimeout(timeout);
    });
  });
};

onMounted(() => {
  if (viewRef.value) viewRef.value.addEventListener("scroll", handleScroll);
  nextTick(buttonInit);
});

onUnmounted(() => {
  if (viewRef.value) viewRef.value.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div ref="viewRef" class="view" @scroll="handleScroll">
    <Physics class="main-phy" />
    <SpeedLine class="speed-line" />
    <ThreeScence class="main-bg" />

    <Transition name="fade">
      <button v-show="isDownBtnShow" ref="downBtnRef" :class="['down-btn', isSuccess && 'success', isPress && 'press']">
        <svg class="progress" viewBox="0 0 32 32">
          <circle r="8" cx="16" cy="16" />
        </svg>
        <span>👍</span>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.view {
  position: relative;
  width: 100%;
  height: 100%;
  isolation: isolate;
  background-color: #ffff8f;

  .main-phy {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .main-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform: translateY(360px);
  }
  .speed-line {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 9;
  }
  .down-btn {
    position: absolute;
    bottom: 80px;
    left: 50%;
    text-align: center;
    align-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    transform: translateX(-50%);
    background-color: #999a9f;
    cursor: pointer;
    isolation: isolate;
    z-index: 10;

    &::before {
      content: "";
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      background-color: #fff;
      z-index: -1;
    }

    .progress {
      position: absolute;
      inset: 0;
      fill: none;
      z-index: -2;
      transform: rotate(-90deg);

      circle {
        stroke-dashoffset: 1;
        stroke-dasharray: var(--progress-array, 0) 52;
        stroke-width: 16;
        stroke: #0b0d0f;
        transition: stroke-dasharray var(--duration) linear;
      }
    }

    &.press,
    &.success {
      --progress-array: 52;
    }
  }
}
</style>
