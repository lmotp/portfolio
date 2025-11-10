<script setup lang="ts">
import step1 from "@/public/images/experiments/step/step-1.webp";
import step2 from "@/public/images/experiments/step/step-2.webp";
import step3 from "@/public/images/experiments/step/step-3.webp";
import step4 from "@/public/images/experiments/step/step-4.webp";

const step = ref(0);
const stepPictures = [step1, step2, step3, step4];
const stepPictureRotaion = [0, 3, -4, 6];

const interval = ref<any>(null);

onMounted(() => {
  interval.value = setInterval(() => {
    step.value += 1;

    if (step.value >= 4) {
      clearInterval(interval.value);
    }
  }, 2000);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="background-wrap">
    <div class="picture-container">
      <template v-for="(picture, index) of stepPictures" :key="index">
        <Transition name="fade">
          <div v-if="step >= index" class="picture-wrap" :style="{ '--rotaion': `${stepPictureRotaion[index]}deg` }">
            <img class="picture" :src="picture" :alt="`step-${index + 1}`" />
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<style scoped>
.background-wrap {
  width: 100%;
  height: 100%;
  background-color: #0b0d0f;

  .picture-container {
    .picture-wrap {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 510px;
      aspect-ratio: 1.777 / 1;
      transform: translate(-50%, -50%) rotate(var(--rotaion));
      transform-origin: center center;

      &::before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        border: 3px solid rgb(14, 14, 14);
        background-color: rgb(255, 254, 250);
        mix-blend-mode: multiply;

        z-index: 10;
        user-select: none;
        pointer-events: none;
      }

      &.fade-enter-active,
      &.fade-leave-active {
        transition: all 1000ms cubic-bezier(0.08, 0.82, 0.17, 1), filter 1000ms ease-in-out;
      }

      &.fade-enter-from,
      &.fade-leave-to {
        top: 175%;
        transform: translate(-50%, -50%) scale(2) rotate(5deg);
        filter: blur(3px);
      }

      .picture {
        position: absolute;
        inset: 0;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
}

@keyframes completed {
  50% {
    transform: translate(-50%, -50%) rotate(var(--rotaion)) scale(1);
    filter: blur(0px);
  }
  90% {
    opacity: 1;
    filter: blur(1px);
    transform: translate(-50%, -50%) rotate(var(--rotaion)) scale(2.15);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--rotaion)) scale(2.25);
  }
}
</style>
