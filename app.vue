<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <Transition name="page" mode="out-in">
      <div class="page-wrapper">
        <NuxtPage />
      </div>
    </Transition>
  </NuxtLayout>
</template>

<style scoped></style>
