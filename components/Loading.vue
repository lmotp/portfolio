<script setup>
import step1 from "@/assets/images/step-1.webp";
import step2 from "@/assets/images/step-2.webp";
import step3 from "@/assets/images/step-3.webp";
import step4 from "@/assets/images/step-4.webp";
import seed from "@/assets/images/seed.png";

const step = ref(0);
const stepPictures = [step1, step2, step3, step4];

let test;

watch(step, (val) => {
  if (val > 5) clearInterval(test);
});

onMounted(() => {
  test = setInterval(() => {
    step.value += 1;
  }, 5000);
});
</script>

<template>
  <div class="custom-loading-indicator">
    <div class="background-wrap">
      <img class="seed" :src="seed" alt="" />

      <div class="picture-container">
        <template v-for="(picture, index) of stepPictures" :key="index">
          <Transition name="picture-in">
            <div v-show="step >= index" class="picture-wrap">
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
    background: linear-gradient(180deg, #d4e0f4 0, #ecf1fa 100%);
    overflow: hidden;

    .picture-container {
      .picture-wrap {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 560px;
        aspect-ratio: 1.777 / 1;

        transform: translate(-50%, -50%);

        &::before {
          content: "";
          position: absolute;
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          background-color: rgb(255, 254, 250);
          z-index: 10;
          mix-blend-mode: multiply;
        }

        .picture {
          position: absolute;
          inset: 0;
          border-radius: 4px;
          object-fit: cover;
          border: 3px solid rgb(14, 14, 14);
        }
      }
    }

    img.seed {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.picture-in-enter-active,
.picture-in-leave-active {
  transition: all 0.5s ease;
  .picture-wrap {
    transition: all 0.5s ease;
  }
}

.picture-in-enter-from,
.picture-in-leave-to {
  opacity: 0;

  .picture-wrap {
    top: 175%;
  }
}
</style>
