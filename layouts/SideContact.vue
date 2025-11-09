<script setup lang="ts">
const props = defineProps<{ path: string }>();
</script>

<template>
  <div class="nav-item">
    <div class="nav-item-header">
      <button :class="{ 'is-active': path === '/contact' }">
        <strong>Contact</strong>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
          <path d="M.63 1h19.373v20"></path>
          <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  padding: 10px 14px;
  width: 420px;
  height: 158px;
  border-radius: 5px;
  background-color: red;
  box-shadow: 0 0 0 1px black;

  .nav-item-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      width: 100%;

      strong {
        font-size: 24px;
      }

      svg {
        width: 20px;
        height: 15px;
        stroke: black;
        stroke-width: 2px;
        transform: rotate(45deg);

        path {
          transition: stroke-dashoffset 0.4s cubic-bezier(1, 0, 0.25, 0.995);

          &:first-child {
            stroke-dasharray: 40;
            stroke-dashoffset: 40;
            transition-delay: 0.15s;
          }
          &:nth-child(2) {
            stroke-dasharray: 28;
            stroke-dashoffset: 28;
          }
        }
      }

      &:hover,
      &.is-active {
        svg {
          path {
            stroke-dashoffset: 0;
          }
        }
      }
    }

    p {
      font-size: 14px;
      color: black;
    }
  }
}
</style>
