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
    <Transition name="toggle">
      <div v-show="isToggle" class="side__menu">
        <div v-for="card of cards" :key="`card-${card.key}`">
          <NuxtImg :src="card.imgSrc" alt="" />
        </div>
      </div>
    </Transition>

    <button class="side__toggle-btn" @click="handleMenuToggle">{{ isToggle ? "열기" : "닫기" }}</button>
  </aside>
</template>

<style scoped>
.side {
  position: absolute;
  height: 100%;
  isolation: isolate;

  .side__menu {
    width: 60dvw;
    height: 100%;
    background-color: white;
    z-index: -1;

    &.toggle-enter-active,
    &.toggle-leave-active {
      transition: transform 750ms cubic-bezier(0.08, 0.82, 0.17, 1);
    }

    &.toggle-enter-from,
    &.toggle-leave-to {
      transform: translate(-100%);
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
