<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { storeToRefs } from "pinia";

import usePublicAsset from "~/composables/usePublicAsset";
import { sideMenuData } from "~/utils/data";

import SideButton from "./SideButton.vue";
import SideContact from "./SideContact.vue";
import SideNav from "./SideNav.vue";
import SideCard from "./SideCard.vue";

const isClose = ref(false);
const isAsideOpen = ref(false);
const audio = ref<HTMLAudioElement | null>(null);

const scrollTriggerStore = useScrollTriggerStore();
const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);
const { lenisRef } = storeToRefs(scrollTriggerStore);

const handleToggleButton = () => {
  isClose.value = !isClose.value;
};

const handleMenuClick = (menuPath: string) => {
  if (menuPath === path.value) return;

  switch (menuPath) {
    case "/":
      lenisRef.value!.scrollTo(0, {
        duration: 3.5,
      });
      break;

    case "/archives":
      lenisRef.value!.scrollTo(".outro .top-view-container", {
        offset: window.innerHeight,
        duration: 3.5,
      });
      break;

    case "/experiments":
      lenisRef.value!.scrollTo(".experiments .intro-wrapper", {
        duration: 3.5,
      });
      break;
  }

  path.value = menuPath;
  isClose.value = false;
};
const handleContactClick = () => {
  isAsideOpen.value = true;
};

watch(isClose, (status) => {
  if (status) audio.value?.play();
});

onMounted(() => {
  lenisRef.value?.stop();
  audio.value = new Audio(usePublicAsset("/sounds/drawer.mp3"));
});

onUnmounted(() => {
  lenisRef.value?.start();
});
</script>

<template>
  <header :class="['header-container']">
    <div
      :class="['overlay', isClose && 'is-close']"
      :aria-hidden="!isClose"
      @click.self="() => (isClose = false)"
    ></div>

    <SideButton @toggle="handleToggleButton" :isClose="isClose" />
  </header>

  <Transition :duration="{ enter: 700, leave: 800 }">
    <nav :class="['nav-wrap']" v-show="isClose">
      <SideNav
        v-for="(menu, name, index) in sideMenuData"
        :key="index"
        class="nav-content"
        v-bind="{ menu, name, path }"
        @menu-click="handleMenuClick"
      />
      <SideContact class="nav-content" @menu-click="handleContactClick" />
    </nav>
  </Transition>

  <aside :class="['aside', isAsideOpen && 'is-open']">
    <div @click="isAsideOpen = false" class="dim"></div>

    <SideCard v-if="isAsideOpen" />
  </aside>
</template>

<style scoped>
.header-container {
  .overlay {
    position: fixed;
    inset: 0;
    opacity: 0;
    backdrop-filter: blur(6px);
    background-color: rgba(20, 20, 20, 0.45);
    z-index: 100;
    pointer-events: none;
    user-select: none;

    transition: opacity 0.3s ease-out;

    &.is-close {
      opacity: 1;
      pointer-events: auto;
      user-select: auto;
    }
  }
}

.nav-wrap {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px;
  width: 420px;
  height: 100dvh;
  z-index: 101;

  &.v-enter-active .nav-content {
    transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);

    &:first-child {
      transition-delay: 0.05s;
    }
    &:nth-child(2) {
      transition-delay: 0.1s;
    }
    &:nth-child(3) {
      transition-delay: 0.15s;
    }
    &:nth-child(4) {
      transition-delay: 0.2s;
    }
  }
  &.v-leave-active .nav-content {
    transition: transform 0.8s cubic-bezier(1, 0, 0.25, 0.995);
    transform-origin: bottom left;

    &:last-child {
      transition-delay: 0.05s;
    }
    &:nth-last-child(2) {
      transition-delay: 0.1s;
    }
    &:nth-last-child(3) {
      transition-delay: 0.15s;
    }
    &:nth-last-child(4) {
      transition-delay: 0.2s;
    }
  }

  &.v-enter-from .nav-content {
    transform: translateX(calc(-100% - 5px));
  }
  &.v-enter-to .nav-content {
    transform: translateX(0);
  }
  &.v-leave-to .nav-content {
    &:first-child {
      transform: translateX(0) translateY(100vh) rotate(24deg);
    }
    &:nth-child(2) {
      transform: translateX(0) translateY(100vh) rotate(-24deg);
    }
    &:nth-child(3) {
      transform: translateX(0) translateY(100vh) rotate(24deg);
    }
    &:last-child {
      transform: translateX(0) translateY(100vh) rotate(-24deg);
    }
  }
}

.aside {
  position: fixed;
  inset: 0;
  isolation: isolate;
  z-index: 10000;
  pointer-events: none;

  .dim {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: rgba(11, 13, 15, 0.305);
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: opacity 1s ease-out;
  }

  &.is-open {
    pointer-events: auto;

    .dim {
      opacity: 1;
    }
  }
}

@media screen and (max-width: 768px) {
  .nav-wrap {
    --button-offset: 60px;

    width: 100%;
    height: calc(100dvh - var(--button-offset));
    top: var(--button-offset);
  }
}
</style>
