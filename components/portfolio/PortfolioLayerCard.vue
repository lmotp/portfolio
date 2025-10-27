<script setup lang="ts">
import gsap from "gsap";

type cardType = {
  id: number;
  url: string;
  title: string;
  type: string;
  src: string;
  totalAngle: number;
};

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

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div ref="imageWrapperRef" class="layer-card">
    <p>
      {{ props.title }} <span>{{ props.id }}</span>
    </p>

    <NuxtLink :to="props.url">
      <figure>
        <img v-if="props.type === 'image'" :src="props.src" :alt="props.title" />
        <video
          v-else
          playsinline
          muted
          autoplay
          loop
          controlslist="nodownload noplaybackrate"
          disablepictureinpicture
          :src="props.src"
        ></video>
      </figure>
    </NuxtLink>
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
  overflow: hidden;

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
    font-size: 42px;
    font-weight: bold;
    color: white;

    span {
      font-size: 16px;
    }
  }
}
</style>
