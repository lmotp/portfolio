<script setup lang="ts">
const isToggle = ref(false);
const cards = [
  { key: 0, imgSrc: "/images/card/sample_1.png" },
  { key: 1, imgSrc: "/images/card/sample_2.png" },
  { key: 2, imgSrc: "/images/card/sample_3.png" },
  { key: 3, imgSrc: "/images/card/sample_4.png" },
  { key: 4, imgSrc: "/images/card/sample_5.png" },
  { key: 5, imgSrc: "/images/card/sample_6.png" },
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

      <div class="side__toggle">
        <button class="side__toggle-btn" @click="handleMenuToggle">
          <div class="btn-inner">
            <span class="line"></span>
            <span class="line"></span>
          </div>
        </button>

        <svg width="168" height="34" viewBox="0 0 168 34" fill="none" class="MenuButtonClip_svg">
          <clipPath id="menuButtonClip">
            <path
              d="M0.988281 -0.12793H167.016L145.491 25.1077C141.691 29.5627 136.13 32.1288 130.274 32.1288H38.4755C32.7372 32.1288 27.2753 29.664 23.4787 25.3612L0.988281 -0.12793Z"
              fill="white"
            ></path>
          </clipPath>
        </svg>
      </div>
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
    grid-template-rows: 1fr 1fr;
    gap: 8px;
    width: 54.5dvw;
    height: 100%;
    padding: 10px;
    background-color: var(--white);
    transform: translateX(-100%);
    transition: transform 750ms cubic-bezier(0.08, 0.82, 0.17, 1);

    &.is-open {
      transform: translateX(0);
    }

    .card {
      width: 100%;
      max-width: 250px;
      aspect-ratio: var(--card-aspect);
      border-radius: var(--card-radius);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .side__toggle {
      position: absolute;
      top: 50%;
      left: 100%;
      z-index: 101;
      transform: translate(calc(-50% + 15px), -50%) rotate(-90deg);

      .side__toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 168px;
        height: 34px;
        filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.05));

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          width: 100%;
          height: 34px;
          clip-path: url(#menuButtonClip);
          background-color: var(--white);
          border-radius: 0;

          .line {
            display: inline-block;
            width: 24px;
            height: 2px;
            background-color: var(--black);
          }
        }
      }

      .MenuButtonClip_svg {
        position: absolute;
        top: -100vh;
        left: -100vw;
        pointer-events: none;
      }
    }
  }
}
</style>
