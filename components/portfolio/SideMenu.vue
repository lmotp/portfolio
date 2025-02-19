<script setup lang="ts">
const isToggle = ref(false);
const cards = [
  { key: 0, imgSrc: "/images/card/sample_card.png" },
  { key: 1, imgSrc: "/images/card/sample_card.png" },
  { key: 2, imgSrc: "/images/card/sample_card.png" },
  { key: 3, imgSrc: "/images/card/sample_card.png" },
];

const handleMenuToggle = () => {
  isToggle.value = !isToggle.value;
};
</script>

<template>
  <aside id="side" class="side">
    <div :class="['side__menu', isToggle && 'is-open']">
      <div v-for="card of cards" :key="`card-${card.key}`" class="card">
        <NuxtImg :src="card.imgSrc" alt="" />
      </div>

      <button class="side__toggle-btn" @click="handleMenuToggle">{{ isToggle ? "닫기" : "열기" }}</button>
    </div>
  </aside>
</template>

<style scoped>
.side {
  position: absolute;
  height: 100%;
  isolation: isolate;

  .side__menu {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 8px;
    width: 60dvw;
    height: 100%;
    background-color: white;
    z-index: -1;
    transform: translateX(-100%);
    transition: transform 750ms cubic-bezier(0.08, 0.82, 0.17, 1);

    &.is-open {
      transform: translateX(0);
    }

    .card {
      width: 100%;
      aspect-ratio: 0.6;
      border-radius: 20px;
      outline: 1px solid red;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .side__toggle-btn {
    position: absolute;
    top: 50%;
    left: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: red;

    transform: translateY(-50%);
  }
}
</style>
