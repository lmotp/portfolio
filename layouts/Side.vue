<script setup lang="ts">
import { useDraggable } from "@vueuse/core";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const menuList = [
  {
    name: "Main",
    path: "/",
  },
  {
    name: "Portfolio",
    path: "/portfolio",
  },
  {
    name: "About",
    path: "/about",
  },
];

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const menuRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false); // 메뉴 열림 상태 관리
const isGrabbing = ref(false);

// 초기 위치 설정
const OPEN_X = 0; // 메뉴가 열린 상태 (px)

const initialX = ref(-384); // 메뉴가 숨겨진 상태 (px)
const closeThreshold = ref(-350); // 닫힘/열림 결정 기준 (px)
const menuWidth = ref(0);
const audio = ref<HTMLAudioElement | null>(null);

const drabbleOnMove = (position: any) => {
  isGrabbing.value = true;

  // 열린 상태에서 오른쪽으로 드래그하지 못하도록 제한
  if (position.x > OPEN_X && menuWidth.value) {
    x.value = OPEN_X; // x 값을 고정
    isMenuOpen.value = true;
  }
};
// 드래그 종료 시 위치에 따라 열림/닫힘 결정
const drabbleOnEnd = (position: any) => {
  const isOpen = position.x > closeThreshold.value;
  isGrabbing.value = false;

  if (isOpen) {
    // 메뉴 열기
    x.value = OPEN_X;
    isMenuOpen.value = true;
  } else {
    // 메뉴 닫기
    x.value = initialX.value;
    isMenuOpen.value = false;
  }
};

// useDraggable 설정
const { x } = useDraggable(menuRef, {
  initialValue: { x: initialX.value, y: 0 }, // 초기 위치
  onMove: drabbleOnMove,
  onEnd: drabbleOnEnd,
});

const handleMenuClick = (menuPath: string) => {
  if (menuPath === path.value) return;

  path.value = menuPath;
  x.value = initialX.value; // 드래그 초기값 동기화
};

watch(isMenuOpen, () => {
  audio.value?.play();
});

onMounted(() => {
  nextTick(() => {
    if (menuRef.value) {
      menuWidth.value = menuRef.value.clientWidth;
      audio.value = new Audio("/sounds/drawer.mp3");

      initialX.value = -menuWidth.value; // 메뉴 너비를 기준으로 초기 위치 설정
      closeThreshold.value = -menuWidth.value / 2; // 닫힘/열림 기준도 업데이트
      x.value = initialX.value; // 드래그 초기값 동기화
    }
  });
});
</script>

<template>
  <aside id="side" class="side" :style="{ translate: `${x}px` }">
    <div ref="menuRef" :class="['side__menu', isGrabbing && 'is-grabbing']">
      <div class="side__content">
        <button
          v-for="menu in menuList"
          :key="menu.path"
          :class="['side__content-link', path === menu.path && 'active']"
          @click="handleMenuClick(menu.path)"
        >
          {{ menu.name }}
        </button>
      </div>

      <div class="side__toggle">
        <button class="side__toggle-btn">
          <div class="btn-inner">
            <span class="line"></span>
            <span class="line"></span>
          </div>
        </button>

        <svg width="168" height="34" viewBox="0 0 168 34" fill="none" class="MenuButtonClip_svg">
          <clipPath id="menuButtonClip">
            <path
              d="M0.988281 -0.12793H167.016L145.491 25.1077C141.691 29.5627 136.13 32.1288 130.274 32.1288H38.4755C32.7372 32.1288 27.2753 29.664 23.4787 25.3612L0.988281 -0.12793Z"
            ></path>
          </clipPath>
        </svg>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.side {
  --back-color: rgba(255, 255, 255, 0.9);
  --blur: 4px;

  position: absolute;
  height: 100%;
  background-color: transparent;
  z-index: 100;

  .side__menu {
    position: relative;
    padding: 21px 16px;
    width: calc(350px + 34px);
    height: 100%;
    background-color: var(--back-color);
    backdrop-filter: blur(var(--blur));
    box-shadow: inset -3px 0px 10px 3px rgba(0, 0, 0, 0.2);
    isolation: isolate;

    &.is-grabbing {
      .side__toggle .side__toggle-btn {
        cursor: grabbing;
      }
    }

    .side__content {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      gap: 10px;

      .side__content-link {
        position: relative;
        font-weight: 700;
        font-size: 32px;
        color: #0b0d0f;
        box-shadow: inset 0 -20px 0 transparent;
        isolation: isolate;

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 0;
          box-shadow: inset 0 -20px 0 rgba(191, 255, 161, 0.7);
          z-index: -1;
          user-select: none;
          pointer-events: none;

          transition: width 0.3s ease-in-out;
        }

        &:hover::before,
        &.active::before {
          width: 100%;
        }
      }
    }

    .side__toggle {
      position: absolute;
      top: 50%;
      left: 100%;
      z-index: 101;
      transform: translate(calc(-50% + 16px), -50%) rotate(-90deg);

      .side__toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 168px;
        height: 34px;
        filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.05));
        cursor: grab;

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          width: 100%;
          height: 34px;
          clip-path: url(#menuButtonClip);
          background-color: var(--back-color);

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
