<script setup>
import step1 from "@/assets/images/step-1.webp";
import step2 from "@/assets/images/step-2.webp";
import step3 from "@/assets/images/step-3.webp";
import step4 from "@/assets/images/step-4.webp";

const step = ref(0);
const stepPictures = [step1, step2, step3, step4];
const stepPictureRotaion = [0, 3, -4, 6];

const meteor = computed(() => {
  if (process.client) {
    return [...Array.from({ length: 20 })].map(() => ({
      top: "-5px",
      left: Math.floor(Math.random() * window.innerWidth) + "px",
      animationDelay: Math.random() * 1 + 0.5 + "s",
      animationDuration: Math.floor(Math.random() * 10 + 2.5) + "s",
    }));
  } else return [];
});

const emits = defineEmits(["onLoad"]);

let interval;

watch(step, (val) => {
  if (val >= 5) {
    clearInterval(interval);
    emits("onLoad");
  }
});

onMounted(() => {
  interval = setInterval(() => (step.value += 1), 2000);
});
</script>

<template>
  <div class="custom-loading-indicator">
    <div class="background-wrap">
      <div class="meteors-wrap">
        <span v-for="(s, i) of meteor" :key="i" :style="s" class="wrapper">
          <div class="tail" />
        </span>
      </div>

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
  </div>
</template>

<style scoped>
.custom-loading-indicator {
  position: fixed;
  inset: 0;
  border: 15px solid #fff;
  background-color: white;
  z-index: 9999;

  .background-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-color: #0c0a09;
    overflow: hidden;

    .meteors-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      transform: translateX(-50%);

      .wrapper {
        --tw-shadow: 0 0 0 1px #ffffff10;
        --tw-ring-shadow: 0 0 #0000;
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 99999px;
        background-color: #a1a1aa;
        box-shadow: var(--tw-ring-shadow), var(--tw-ring-shadow), var(--tw-shadow);
        pointer-events: none;
        isolation: isolate;

        animation: meteor 5s linear infinite forwards;

        .tail {
          position: absolute;
          top: 50%;
          width: 50px;
          height: 1px;
          background-image: linear-gradient(to right, rgb(161, 161, 170), rgba(0, 0, 0, 0));
          z-index: -10;
        }
      }
    }

    .picture-container {
      .picture-wrap {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 510px;
        aspect-ratio: 1.777 / 1;
        transform: translate(-50%, -50%) rotate(var(--rotaion));

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
}

@keyframes meteor {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(215deg) translateX(-1000px);
    opacity: 0;
  }
}
</style>
