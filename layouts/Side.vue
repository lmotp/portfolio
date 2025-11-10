<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

import SideButton from "./SideButton.vue";
import SideContact from "./SideContact.vue";
import SideNav from "./SideNav.vue";
import sideMenu from "./sideMenu.json";

const isClose = ref(false);
const audio = ref<HTMLAudioElement | null>(null);

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const handleToggleButton = () => {
  isClose.value = !isClose.value;
};

const handleMenuClick = (menuPath: string) => {
  if (menuPath === path.value) return;

  path.value = menuPath;
  isClose.value = false;
};

watch(isClose, (status) => {
  if (status) audio.value?.play();
});

onMounted(() => {
  audio.value = new Audio("@/public/sounds/drawer.mp3");
});
</script>

<template>
  <header :class="['header-container']">
    <div :class="['overlay', isClose && 'is-close']" :aria-hidden="true"></div>

    <SideButton @toggle="handleToggleButton" :isClose="isClose" />
  </header>

  <Transition :duration="{ enter: 700, leave: 800 }">
    <nav :class="['nav-wrap']" v-show="isClose">
      <SideNav
        v-for="(menu, name, index) in sideMenu"
        :key="index"
        class="nav-content"
        v-bind="{ menu, name, path }"
        @menu-click="handleMenuClick"
      />
      <SideContact class="nav-content" :path="path" />
    </nav>
  </Transition>
</template>

<style scoped>
.header-container {
  .overlay {
    position: fixed;
    inset: 0;
    opacity: 0;
    backdrop-filter: blur(6px);
    background-color: rgba(20, 20, 20, 0.45);
    pointer-events: none;
    user-select: none;
    z-index: 100;

    transition: opacity 0.3s ease-out;

    &.is-close {
      opacity: 1;
      pointer-events: auto;
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
</style>
