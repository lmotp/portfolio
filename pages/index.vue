<script setup lang="ts">
const isLoading = ref(true);

const handleOnLoad = async () => {
  isLoading.value = false;
};
</script>

<template>
  <div class="container">
    <ClientOnly>
      <MainLoading v-if="isLoading" @onLoad="handleOnLoad" />
    </ClientOnly>

    <Transition name="completed">
      <MainThreeScene v-if="!isLoading" />
    </Transition>
    <!-- <MainSeeds :isLoading="isLoading" /> -->
  </div>
</template>

<style scoped>
.completed-enter-active,
.completed-leave-active {
  transition: all 2000ms cubic-bezier(0.08, 0.82, 0.17, 1);
}

.completed-enter-from,
.completed-leave-to {
  opacity: 0;
  filter: blur(1px);
  transform: scale(1.125);
}
</style>
