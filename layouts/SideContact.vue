<script setup lang="ts">
const emits = defineEmits(["menuClick"]);
const copiedList = ref<string[]>([]);

const handleClickCopy = (text: string, type: string) => {
  navigator.clipboard.writeText(text).then(() => {
    if (copiedList.value.includes(type)) return;

    copiedList.value.push(type);

    setTimeout(() => {
      copiedList.value = copiedList.value.filter((item) => item !== type);
    }, 2000);
  });
};

const handleClickAbout = () => {
  emits("menuClick");
};
</script>

<template>
  <div class="nav-item">
    <strong class="nav-item-header">Contact</strong>

    <div class="nav-item-childs">
      <button class="nav-child" @click="handleClickCopy('unoeye22@gmail.com', 'mail')">
        <span> Mail </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
          <path d="M.63 1h19.373v20"></path>
          <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
        </svg>

        <Transition name="copy-fade">
          <div v-if="copiedList.includes('mail')" class="copy-tooltip" role="tooltip">Copied</div>
        </Transition>
      </button>

      <button class="nav-child" @click="handleClickCopy('010-5408-6369', 'phone')">
        <span>Phone</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
          <path d="M.63 1h19.373v20"></path>
          <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
        </svg>

        <Transition name="copy-fade">
          <div v-if="copiedList.includes('phone')" class="copy-tooltip" role="tooltip">Copied</div>
        </Transition>
      </button>

      <NuxtLink to="https://github.com/lmotp" target="_blank" class="nav-child">
        <span>GitHub</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 22" aria-hidden="true">
          <path d="M.63 1h19.373v20"></path>
          <path d="M0-.5h27.844" transform="matrix(-.69574 .71829 -.69574 -.71829 19.373 1)"></path>
        </svg>
      </NuxtLink>

      <button @click="handleClickAbout" class="nav-child">
        <span>About Me</span>
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
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  width: 100%;
  flex: 1;
  border-radius: 5px;
  background-color: var(--blue);
  box-shadow: 0 0 0 1px var(--black);

  .nav-item-header {
    margin-bottom: 10px;
    font-size: 24px;
    color: var(--white);
  }

  .nav-item-childs {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;

    .nav-child {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;

      &:last-child {
        margin-top: auto;
      }

      span {
        font-size: 16px;
        color: var(--white);
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

      .copy-tooltip {
        position: absolute;
        left: calc(100% + 24px);
        top: 50%;
        padding: 4px 8px;
        font-size: 12px;
        color: var(--white);
        border-radius: 5px;
        background-color: var(--black);
        box-shadow: 0 0 0 1px var(--white);

        transform: translate(0%, -50%);
        z-index: -1;

        &.copy-fade-enter-active,
        &.copy-fade-leave-active {
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }

        &.copy-fade-enter-from,
        &.copy-fade-leave-to {
          transform: translate(-100%, -50%);
          opacity: 0;
        }
      }

      &:hover {
        svg {
          path {
            stroke-dashoffset: 0;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .nav-item {
    .nav-item-header {
      font-size: 18px;
    }

    .nav-item-childs .nav-child span {
      font-size: 14px;
    }
  }
}
</style>
