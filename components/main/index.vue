<script setup lang="ts">
import Logo1 from "./Logo1.vue";
import Logo2 from "./Logo2.vue";
import Logo3 from "./Logo3.vue";
import Logo4 from "./Logo4.vue";
import Logo5 from "./Logo5.vue";
</script>

<template>
  <div class="main">
    <Logo1 class="logo" />
    <Logo2 class="logo" />
    <Logo3 class="logo" />
    <Logo4 class="logo" />
    <Logo5 class="logo" />
  </div>
</template>

<style scoped>
.main {
  padding: var(--frame);

  .logo {
    width: 100px;
    height: 100px;
  }
}
</style>
