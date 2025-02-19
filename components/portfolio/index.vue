<script setup>
import SideMenu from "./SideMenu.vue";
import PlayerStatus from "./PlayerStatus.vue";
import CardTile from "./CardTile.vue";
</script>

<template>
  <section class="portfolio">
    <PlayerStatus />
    <SideMenu />
    <CardTile />
  </section>
</template>

<style lang="scss" scoped>
.portfolio {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
