<script setup lang="ts">
interface Menu {
  path: string;
  name?: string;
  desc?: string;
  childs?: Menu[];
}

const props = defineProps<{ menu: Menu; name: string; path: string }>();
const emits = defineEmits(["menu-click"]);

const handleMenuClick = (menuPath: string) => {
  if (menuPath === "/about") {
  } else emits("menu-click", menuPath);
};
</script>

<template>
  <div class="nav-item">
    <div class="nav-item-header">
      <button @click="handleMenuClick(menu.path)" :class="{ 'is-active': path === menu.path }">
        <strong>{{ name }}</strong>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
          <path d="M.63 1h19.373v20"></path>
          <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
        </svg>
      </button>

      <p v-if="menu?.desc">{{ menu.desc }}</p>
    </div>

    <div class="nav-item-childs" v-if="menu?.childs">
      <div v-for="(child, index) in menu.childs" :key="index" class="child">
        <button @click="handleMenuClick(child.path)">{{ child.name }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  width: 100%;
  padding: 10px 14px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 0 0 1px black;

  &:first-child .nav-item-header {
    margin-bottom: 0;
  }

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
      color: gray;
    }
  }

  .nav-item-childs {
    display: flex;
    flex-wrap: wrap;
    gap: 3px 2.5px;

    .child {
      display: flex;
      width: calc(50% - 2.5px);

      button {
        position: relative;
        width: 100%;
        text-align: left;
        padding-left: 0;
        color: black;
        transition: color 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0.1s, padding-left 0.3s cubic-bezier(0.19, 1, 0.22, 1);

        isolation: isolate;

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          background-color: red;
          z-index: -1;

          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          transform-origin: left;
        }

        &:hover {
          color: white;
          padding-left: 4px;

          &::before {
            transform: scaleX(1);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .nav-item {
    .nav-item-header {
      button strong {
        font-size: 18px;
      }
      p {
        font-size: 12px;
      }
    }

    .nav-item-childs {
      .child {
        width: calc(100% / 3 - 2px);

        button {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
