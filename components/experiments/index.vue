<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const menuList = [
  {
    name: "Burn",
    path: "/experiments/burn",
    src: "/images/skills/0.webp",
  },
  {
    name: "Glitch",
    path: "/experiments/glitch",
    src: "/images/skills/1.webp",
  },
  {
    name: "Kuji",
    path: "/experiments/kuji",
    src: "/images/skills/2.webp",
  },
  {
    name: "Roll",
    path: "/experiments/roll",
    src: "/images/skills/3.webp",
  },
  {
    name: "Pinball",
    path: "/experiments/pinball",
    src: "/images/skills/4.webp",
  },
  {
    name: "Blur",
    path: "/experiments/blur",
    src: "/images/skills/5.webp",
  },
];

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const handleMenuClick = (menuPath: string) => {
  if (menuPath === path.value) return;

  path.value = menuPath;
};
</script>

<template>
  <div class="link-wrap">
    <div class="button-wrap">
      <button
        v-for="menu in menuList"
        :key="menu.path"
        @click="handleMenuClick(menu.path)"
        :style="{ '--data-src': `url(${menu.src})` }"
      >
        <div class="text-wrap">
          <div class="blend"></div>
          <strong>{{ menu.name }}</strong>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.link-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100dvh;

  .button-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    max-width: 1000px;

    button {
      display: flex;
      align-items: flex-end;
      flex: 1;
      height: 300px;
      border-radius: 12px;
      background: var(--data-src) center;
      background-size: cover;
      overflow: hidden;

      transition: flex 0.3s ease-in-out;

      &:hover {
        flex: 5;
      }

      .text-wrap {
        position: relative;
        width: 100%;
        text-align: left;

        .blend {
          position: absolute;
          inset: 0;
          background-color: red;
          mix-blend-mode: multiply;
        }

        strong {
          display: inline-block;
          padding: 8px;
          font-size: 16px;
          color: white;
        }
      }
    }
  }
}
</style>
