<script setup lang="ts">
import gsap from "gsap";

type cardType = {
  id: number;
  url: string;
  title: string;
  src: string;
  totalAngle: number;
};

const emit = defineEmits(["onClick"]);
const props = defineProps<cardType>();
const imageWrapperRef = ref<HTMLElement | null>(null);

const init = () => {
  if (!imageWrapperRef.value) return;

  const angle = props.totalAngle * props.id;
  const radius = 1100;
  const x = window.innerWidth / 2 + radius * Math.cos(angle);
  const y = window.innerHeight / 2 + radius * Math.sin(angle);
  const rotation = (angle * 180) / Math.PI;

  gsap.set(imageWrapperRef.value, {
    x,
    y,
    rotation,
  });
};

const hadnleClickRoute = () => {
  const angle = props.totalAngle * props.id;
  emit("onClick", { url: props.url, angle });
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div ref="imageWrapperRef" class="layer-card" @click="hadnleClickRoute">
    <p>
      {{ props.title }} <span>{{ props.id }}</span>
    </p>

    <div>
      <figure>
        <img :src="props.src" :alt="props.title" />
      </figure>
    </div>
  </div>
</template>

<style scoped>
.layer-card {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 800px;
  height: 80px;
  transform: translate(-50%, -50%);
  background-color: transparent;
  cursor: pointer;
  clip-path: polygon(100% -25%, 0 15%, 0 85%, 100% 125%);

  transition: margin-left 0.3s cubic-bezier(0.19, 1, 0.22, 1), padding-left 0.3s cubic-bezier(0.19, 1, 0.22, 1),
    background-color 0.3s cubic-bezier(0.19, 1, 0.22, 1);

  &:hover {
    padding-left: 10px;
    margin-left: 30px;
    background-color: red;
  }

  figure {
    height: 100%;

    > * {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  p {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    width: 250px;
    flex-shrink: 0;
    font-size: 38px;
    font-weight: bold;
    color: white;

    span {
      font-size: 16px;
    }
  }
}
</style>
