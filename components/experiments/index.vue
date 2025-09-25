<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const menuList = [
  {
    name: "Burn",
    path: "/experiments/burn",
  },
  {
    name: "Glitch",
    path: "/experiments/glitch",
  },
  {
    name: "Kuji",
    path: "/experiments/kuji",
  },
  {
    name: "Roll",
    path: "/experiments/roll",
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
  <div>
    메인입니다
    <div class="link-wrap">
      <button v-for="menu in menuList" :key="menu.path" @click="handleMenuClick(menu.path)">
        {{ menu.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.link-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
</style>
