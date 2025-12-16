<script setup lang="ts">
import Logo1 from "@/components/logo/Logo1.vue";
import Logo2 from "@/components/logo/Logo2.vue";
import Logo3 from "@/components/logo/Logo3.vue";
import Logo4 from "@/components/logo/Logo4.vue";
import Logo5 from "@/components/logo/Logo5.vue";

import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const pageTransitionStore = usePageTransitionStore();
const { isLoading } = storeToRefs(pageTransitionStore);

const percent = ref(0);
const interval = ref<any>(null);

const init = () => {
  interval.value = setInterval(() => {
    percent.value += 1;
    if (percent.value >= 100) {
      clearInterval(interval.value);
      isLoading.value = false;
    }
  }, 50);
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div :class="['loading-wrap', !isLoading && 'fade']">
    <strong class="percent">{{ percent < 10 ? `0${percent}` : percent }}</strong>
    <div class="logo-wrap">
      <Logo1 class="logo" />
      <Logo2 class="logo" />
      <Logo3 class="logo" />
      <Logo4 class="logo" />
      <Logo5 class="logo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-wrap {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #141414;
  z-index: 2000;

  &.fade {
    animation: fade 0.5s ease-in-out forwards;
  }

  .percent {
    color: white;
    font-size: 32px;
    font-weight: bold;
  }
  .logo-wrap {
    display: flex;
    gap: 10px;

    .logo {
      width: 50px;
      height: 50px;
    }
  }
}

@keyframes fade {
  100% {
    opacity: 0;
    display: none;
  }
}
</style>
