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
const icons = computed(() => {
  return [
    { name: "Nuxt", src: "simple-icons:nuxtdotjs" },
    { name: "SCSS", src: "simple-icons:sass" },
    { name: "Chart", src: "simple-icons:chartdotjs" },
    { name: "Storybook", src: "simple-icons:storybook" },
    { name: "Express", src: "simple-icons:express" },
  ].map((v) => ({ ...v, isActive: stack.includes(v.name) }));
});

const init = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".article-top",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  tl.fromTo(".picture", { transform: " scale(1.1)" }, { transform: "translateY(10%) scale(1)" });
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
        <h2>{{ title }}</h2>

        <ul>
          <li v-for="(svg, id) of icons" :key="`stack-${id}`">
            <Icon :name="svg.src" size="40" :class="[svg.isActive && 'active']" />
          </li>
        </ul>
        <time :datetime="date">{{ date }}</time>
      </div>
    </div>

    <div class="info-wrap">
      <p>{{ desc }}</p>

      <imageBlur />
    </div>
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
    box-shadow: 0 0 0 1px #000a;

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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-block: 32px 42px;
    text-align: center;

    h2 {
      font-size: 96px;
      text-transform: uppercase;
      color: #0b0d0f;
      line-height: 1.5;
    }

    ul {
      display: flex;
      gap: 18px;
      margin-bottom: 24px;

      li {
        display: flex;

        span {
          color: #e8e8e8;

          &.active {
            color: #0b0d0f;
          }
        }
      }
    }

    time {
      font-size: 14px;
      color: #868a93;
      white-space: pre-wrap;
    }
  }
}

.info-wrap {
  p {
    font-size: 18px;
    text-align: center;
    color: #0b0d0f;
    white-space: pre-wrap;
  }
}
</style>
