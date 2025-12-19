<script setup lang="ts">
import gsap from "gsap";
import imageBlur from "./imageBlur.vue";

type configType = {
  id: number;
  title: string;
  desc: string;
  date: string;
  stack: string[];
  mainImg: { src: string; type: string };
};

const { config } = defineProps<{ config: configType }>();
const { id, title, desc, date, stack, mainImg } = config;

const init = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".article-top",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  tl.fromTo(
    ".picture",
    {
      transform: "translateY(-10%) scale(1.2)",
    },
    {
      transform: "translateY(10%) scale(1.2)",
    }
  );
};

const getIconName = (stackName: string) => {
  const map: Record<string, string> = {
    Nuxt: "simple-icons:nuxtdotjs",
    Storybook: "simple-icons:storybook",
    SCSS: "simple-icons:sass",
    Express: "simple-icons:express",
    Chart: "simple-icons:chartdotjs",
  };
  return map[stackName] || "";
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <article :id="`work-${id}`">
    <div class="article-top">
      <div class="main-picture-wrap">
        <div class="picture-bg"></div>

        <img v-if="mainImg.type === 'image'" class="picture" :src="mainImg.src" :alt="title" />
        <video
          v-else
          class="picture"
          playsinline
          muted
          autoplay
          loop
          controlslist="nodownload noplaybackrate"
          disablepictureinpicture
          :src="mainImg.src"
        ></video>
      </div>

      <div class="title-wrap">
        <time :datetime="date">{{ date }}</time>
        <h2>{{ title }}</h2>
      </div>
    </div>

    <div class="info-wrap">
      <p>{{ desc }}</p>

      <ul>
        <li v-for="(value, id) of stack" :key="`stack-${id}`">
          <Icon :name="getIconName(value)" size="48" />
        </li>
      </ul>
    </div>

    <imageBlur />
  </article>
</template>

<style scoped>
.article-top {
  display: flex;
  flex-direction: column;
  height: 100dvh;

  .main-picture-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex: 1;
    width: 100%;
    min-height: 0;
    isolation: isolate;
    overflow: hidden;

    .picture-bg {
      display: flex;
      position: absolute;
      inset: 0%;
      background-image: linear-gradient(#000c, #fff0 55%);
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title-wrap {
    padding-block: 42px 32px;
    text-align: center;

    h2 {
      font-size: 96px;
      text-transform: uppercase;
      color: #0b0d0f;
    }

    time {
      font-size: 14px;
      color: #868a93;
    }
  }
}

.info-wrap {
  ul {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
}
</style>
