<script setup>
import SideMenu from "./SideMenu.vue";
import MainView from "./MainView.vue";
</script>

<template>
  <section class="portfolio">
    <MainView />
    <SideMenu />
  </section>
</template>

<style lang="scss" scoped>
.portfolio {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
