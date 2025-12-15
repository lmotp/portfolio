<script setup lang="ts">
const props = defineProps<{ isClose: boolean }>();
const emit = defineEmits(["toggle"]);
</script>

<template>
  <button :class="['side-toggle', isClose && 'is-close']" @click="emit('toggle')">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 45 25" aria-hidden="true" class="svg-menu close">
      <path d="M0 .5h45"></path>
      <path d="M0 12.5h45"></path>
      <path d="M0 24.5h45"></path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 26" aria-hidden="true" class="svg-menu open">
      <path d="M24.293 1.354.716 24.931"></path>
      <path d="m.354.646 23.577 23.578"></path>
    </svg>
  </button>
</template>

<style scoped>
.side-toggle {
  position: fixed;
  top: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: black;
  box-shadow: 0 0 0 1px white;
  overflow: hidden;
  z-index: 102;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    transform: scaleX(0);
    transform-origin: right;
    background-color: red;
    transition: transform 0.4s cubic-bezier(1, 0, 0.25, 0.995);
  }

  .svg-menu {
    width: 100%;
    height: 100%;
    stroke: white;
    stroke-width: 2px;
    transition: stroke 0.6s cubic-bezier(0.19, 1, 0.22, 1);

    path {
      transition: stroke-dashoffset 0.6s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &.close {
      position: relative;
      width: 20px;
      height: 20px;

      path {
        stroke-dasharray: 45;
        stroke-dashoffset: 0;

        &:first-child {
          transition-delay: 0.5s;
        }

        &:nth-child(2) {
          transition-delay: 0.6s;
        }

        &:nth-child(3) {
          transition-delay: 0.7s;
        }
      }
    }

    &.open {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      transform: translate(-50%, -50%);

      path {
        stroke-dasharray: 34;
        stroke-dashoffset: 34;

        &:first-child {
          transition-delay: 0.1s;
        }

        &:nth-child(2) {
          transition-delay: 0.2s;
        }
      }
    }
  }

  &:hover {
    &::before {
      transform: scaleX(1);
      transform-origin: left;
      transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
    }

    .svg-menu {
      stroke: black;
    }
  }

  &.is-close {
    .svg-menu {
      &.close path {
        stroke-dashoffset: 45;

        &:first-child {
          transition-delay: 0.1s;
        }

        &:nth-child(2) {
          transition-delay: 0.2s;
        }

        &:nth-child(3) {
          transition-delay: 0.3s;
        }
      }
      &.open path {
        stroke-dashoffset: 0;

        &:first-child {
          transition-delay: 0.5s;
        }

        &:nth-child(2) {
          transition-delay: 0.6s;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .side-toggle {
    zoom: 0.8;
  }
}
</style>
