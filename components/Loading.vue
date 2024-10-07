<script setup>
import step1 from "@/assets/images/step-1.webp";
import step2 from "@/assets/images/step-2.webp";
import step3 from "@/assets/images/step-3.webp";
import step4 from "@/assets/images/step-4.webp";
import seed from "@/assets/images/seed.png";

const stepPictures = [step1, step2, step3, step4];
const step = ref(0);

onMounted(() => {});
</script>

<template>
  <div class="custom-loading-indicator">
    <div class="background-wrap">
      <img class="seed" :src="seed" alt="" />
      <div class="picture-wrap">
        <template v-for="(picture, index) of stepPictures" :key="index">
          <Transition name="picture-in">
            <img class="picture" v-show="step >= index" :src="picture" :alt="`step-${index + 1}`" />
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

    .picture-wrap {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .picture {
        width: 560px;
        border-radius: 4px;
        object-fit: cover;
        aspect-ratio: 1.777 / 1;
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
</style>
