<script setup lang="ts">
const props = defineProps<{ text: string }>();
const svgRef = ref<HTMLElement | null>(null);
const textOffset = computed(() => {
  const offset = 20;
  const size = svgRef.value?.clientWidth || 0;

  return size + offset;
});
</script>

<template>
  <button @click="$emit('onClick')" :data-detail="true">
    <svg xmlns="http://www.w3.org/2000/svg" class="left" fill="currentColor" viewBox="0 0 22 19">
      <path
        d="m10.392 16.88 7.232-7.264-7.264-7.232 1.696-1.76 8.992 8.992-8.96 8.992zM.568 8.304h18.4v2.656H.568z"
      ></path>
    </svg>

    <strong :style="{ '--text-offset': `${textOffset}px` }">{{ props.text }}</strong>

    <svg ref="svgRef" class="right" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 19">
      <path
        d="m10.392 16.88 7.232-7.264-7.264-7.232 1.696-1.76 8.992 8.992-8.96 8.992zM.568 8.304h18.4v2.656H.568z"
      ></path>
    </svg>
  </button>
</template>

<style scoped>
button {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: currentColor;

  > * {
    pointer-events: none;
  }

  svg {
    transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);

    &.left {
      position: absolute;
      left: 0;
      display: none;
      transform: translateX(-100%);
      transition-delay: 0s;
      transition-duration: 0.4s;
    }
  }
  strong {
    font-weight: bold;
    color: currentColor;
    transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  }

  @media (hover: hover) {
    svg.left {
      display: flex;
    }

    &:hover {
      svg.left {
        transform: translateX(0);
      }
      svg.right {
        transform: translateX(100%);
      }
      strong {
        transform: translateX(var(--text-offset));
      }
    }
  }
}

@media screen and (max-width: 768px) {
  button {
    padding-inline: 14px;
  }
}
</style>
