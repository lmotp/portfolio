<script setup lang="ts">
import IntroHeroSection from "./IntroHeroSection.vue";
import IntroInfo from "./IntroInfo.vue";
</script>

<template>
  <div class="intro">
    <IntroHeroSection />
    <IntroInfo />
  </div>
</template>

<style scoped>
.intro {
  position: relative;
  z-index: 10;
}

@media screen and (max-width: 1440px) {
  .intro {
  }
}

@media screen and (max-width: 768px) {
  .intro {
  }
}
</style>
