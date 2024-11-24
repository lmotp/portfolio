<script setup lang="ts"></script>

<template>
  <div>
    <!-- <header>
      <NuxtLink to="/">main</NuxtLink>
      <NuxtLink to="/portfolio">portfolio</NuxtLink>
    </header> -->

    <slot />
  </div>
</template>

<style scoped>
header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
