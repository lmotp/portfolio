<script setup lang="ts">
interface Menu {
  path: string;
  name?: string;
  desc?: string;
  childs?: Menu[];
}

const props = defineProps<{ menu: Menu; name: string; path: any }>();
const emits = defineEmits(["menu-click"]);

const isActive = computed(() => {
  if (props.menu.path === "/archives") return props.path.includes("archives");
  else if (props.menu.path === "/experiments") return props.path.includes("experiments");
  else return props.menu.path === props.path;
});

const handleMenuClick = (menuPath: string) => {
  emits("menu-click", menuPath);
};
</script>

<template>
  <div class="nav-item">
    <div class="nav-item-header">
      <button @click="handleMenuClick(menu.path)" :class="{ 'is-active': isActive }">
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
        <button :class="child.path === $route.path ? 'active' : ''" @click="handleMenuClick(child.path)">
          <span>{{ child.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  width: 100%;
  padding: 10px 14px;
  border-radius: 5px;
  background-color: var(--white);
  box-shadow: 0 0 0 1px var(--black);

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
        color: var(--black);
      }

      svg {
        width: 20px;
        height: 15px;
        stroke: var(--black);
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
      color: var(--light-black);
    }
  }

  .nav-item-childs {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 10px;

    .child {
      display: flex;
      width: calc(50% - 10px);

      button {
        width: 100%;
        text-align: left;
        background-color: transparent;
        transition: background-color 200ms cubic-bezier(0.19, 1, 0.22, 1);

        span {
          display: inline-block;
          color: var(--black);
          transform: none;
          transition: color 200ms cubic-bezier(0.19, 1, 0.22, 1), transform 200ms cubic-bezier(0.19, 1, 0.22, 1);
        }

        &:hover,
        &.active {
          background-color: var(--blue);

          span {
            color: var(--white);
            transform: translateX(6px);
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
