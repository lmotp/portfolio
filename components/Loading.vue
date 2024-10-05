<template>
  <div class="custom-loading-indicator">
    <div class="spinner"></div>
    <p>{{ loadingText }}</p>
  </div>
</template>

<script setup>
const loadingText = ref("Loading");

onMounted(() => {
  const texts = ["Loading", "Loading.", "Loading..", "Loading..."];
  let index = 0;

  setInterval(() => {
    loadingText.value = texts[index];
    index = (index + 1) % texts.length;
  }, 500);
});
</script>

<style scoped>
.custom-loading-indicator {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  z-index: 9999;

  & .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #3498db;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
