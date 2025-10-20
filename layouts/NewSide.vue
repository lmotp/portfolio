<script setup lang="ts">
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const isClose = ref(false);

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const handleToggleButton = () => {
  isClose.value = !isClose.value;
};

const handleMenuClick = (menuPath: string) => {
  if (menuPath === path.value) return;

  path.value = menuPath;
  isClose.value = false;
};
</script>

<template>
  <header :class="['header-container']">
    <div :class="['overlay', isClose && 'is-close']"></div>

    <button :class="['side-toggle', isClose && 'is-close']" @click="handleToggleButton">
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

    <Transition :duration="{ enter: 800, leave: 900 }">
      <nav :class="['nav-wrap']" v-show="isClose">
        <div class="nav-content">
          <button @click="handleMenuClick('/')" :class="{ 'is-active': path === '/' }">
            <strong>Main</strong>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
              <path d="M.63 1h19.373v20"></path>
              <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
            </svg>
          </button>
          <p>main</p>
        </div>
        <div class="nav-content">
          <button @click="handleMenuClick('/experiments')" :class="{ 'is-active': path === '/experiments' }">
            <strong>Experiments </strong>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
              <path d="M.63 1h19.373v20"></path>
              <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
            </svg>
          </button>
          <p>experiments</p>
        </div>
        <div class="nav-content">
          <button @click="handleMenuClick('/contact')" :class="{ 'is-active': path === '/contact' }">
            <strong>Contact</strong>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
              <path d="M.63 1h19.373v20"></path>
              <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
            </svg>
          </button>
          <p>contact</p>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header-container {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 100;
  isolation: isolate;

  .overlay {
    position: absolute;
    inset: 0;
    opacity: 0;
    background-color: hsla(0, 0%, 8%, 0.45);
    pointer-events: none;
    z-index: -2;

    transition: opacity 0.3s ease-out;

    &.is-close {
      opacity: 1;
    }
  }

  .side-toggle {
    position: fixed;
    top: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: black;
    overflow: hidden;

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

  .nav-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 3px;
    z-index: -1;

    .nav-content {
      width: 420px;
      padding: 10px 14px;
      border-radius: 5px;
      box-shadow: 0 0 0 1px black;

      &:not(:last-child) {
        flex: 1;
        background-color: white;
      }

      &:first-child {
        padding-top: 70px;
      }

      &:last-child {
        height: 158px;
        background-color: red;
      }

      button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 5px;
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
      }
    }

    &.v-enter-active .nav-content {
      transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), padding-top 0.3s ease-out;

      &:first-child {
        transition-delay: 0.06s;
      }
      &:nth-child(2) {
        transition-delay: 0.12s;
      }
      &:nth-child(3) {
        transition-delay: 0.18s;
      }
    }
    &.v-leave-active .nav-content {
      transition: transform 0.9s cubic-bezier(1, 0, 0.25, 0.995), padding-top 0.2s ease-out;
      transform-origin: bottom left;

      &:last-child {
        transition-delay: 0.06s;
      }
      &:nth-last-child(2) {
        transition-delay: 0.12s;
      }
      &:nth-last-child(3) {
        transition-delay: 0.18s;
      }
    }

    &.v-enter-from .nav-content {
      transform: translateX(calc(-100% - 5px));

      &:first-child {
        padding-top: 70px;
      }
    }
    &.v-enter-to .nav-content {
      transform: translateX(0);

      &:first-child {
        padding-top: 70px;
      }
    }
    &.v-leave-to .nav-content {
      &:first-child {
        padding-top: 10px;
        transform: translateX(0) translateY(100vh) rotate(24deg);
      }
      &:nth-child(2) {
        transform: translateX(0) translateY(100vh) rotate(-24deg);
      }
      &:last-child {
        transform: translateX(0) translateY(100vh) rotate(24deg);
      }
    }
  }
}
</style>
