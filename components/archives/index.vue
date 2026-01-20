<script setup lang="ts">
import { useScrollTriggerStore } from "@/stores/scrollTrigger";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";
import gsap from "gsap";

import usePublicAsset from "~/composables/usePublicAsset";

const { config, nextConfig } = defineProps<{ config: configType; nextConfig: nextConfigType }>();
const { id, title, src, stack, data } = config;
const { nextTitle, nextSrc } = nextConfig;

const scrollTriggerStore = useScrollTriggerStore();
const { scrollTrigger, lenisRef } = storeToRefs(scrollTriggerStore);
const pageTransitionStore = usePageTransitionStore();
const { downloadPercent, isDisabled, path } = storeToRefs(pageTransitionStore);

const { start, finish } = useLoadingIndicator();

const isInit = ref(false);
const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);

const blurWrapRef = ref<HTMLDivElement | null>(null);
const titleWrapRef = ref<HTMLDivElement | null>(null);
const bottomRef = ref<HTMLDivElement | null>(null);
const pictureWrapHeight = ref(window.innerHeight / 2);
const observer = ref<IntersectionObserver | null>(null);
const icons = computed(() => {
  return [
    { name: "Nuxt", src: "simple-icons:nuxtdotjs" },
    { name: "SCSS", src: "simple-icons:sass" },
    { name: "Chart", src: "simple-icons:chartdotjs" },
    { name: "Storybook", src: "simple-icons:storybook" },
    { name: "Express", src: "simple-icons:express" },
  ].map((v) => ({ ...v, isActive: stack?.includes(v.name) }));
});

const init = () => {
  if (titleWrapRef.value) pictureWrapHeight.value = window.innerHeight - titleWrapRef.value.offsetHeight;
  isInit.value = true;

  setupGsapAnimation();
  setupTextObserver();
  checkImagesLoaded();
};

const setupGsapAnimation = () => {
  const tl = gsap.timeline({
    id: `archive-${id}-picture`,
    scrollTrigger: {
      trigger: ".article-top",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  tl.fromTo(".article-top .picture", { transform: " scale(1)" }, { transform: "translateY(10%) scale(1)" });
};
const setupTextObserver = () => {
  if (!blurWrapRef.value) return;
  const caoptions = blurWrapRef.value.querySelectorAll(".media");
  const callback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.value!.unobserve(entry.target);
      }
    });
  };
  const options = {
    threshold: 0.5,
  };
  observer.value = new IntersectionObserver(callback, options);
  caoptions.forEach((el) => observer.value!.observe(el));
};
const checkImagesLoaded = () => {
  if (!blurWrapRef.value) return;
  start();

  const images = blurWrapRef.value.querySelectorAll("img");
  const total = images.length;

  if (total === 0) {
    downloadPercent.value = 100;
    finish();
    return;
  }

  let loadedCount = 0;

  const promises = Array.from(images).map((img) => {
    return new Promise<void>((resolve) => {
      const onImageLoad = () => {
        loadedCount++;
        downloadPercent.value = Math.round((loadedCount / total) * 100);
        resolve();
      };

      if (img.complete) {
        onImageLoad();
      } else {
        img.addEventListener("load", onImageLoad, { once: true });
        img.addEventListener("error", onImageLoad, { once: true });
      }
    });
  });

  Promise.all(promises).then(() => {
    lenisRef.value?.start();
    lenisRef.value?.resize();
    lenisRef.value?.scrollTo(0, { immediate: true });
    scrollTrigger.value?.refresh();

    finish();
  });
};

const handleClickNextWrok = () => {
  if (!bottomRef.value) return;
  isDisabled.value = true;

  const tl = gsap.timeline({
    id: `archive-${id}`,
    onComplete: () => {
      tl.scrollTrigger?.kill();
      tl.kill();

      gsap.getById(`archives-${id}`)?.kill();

      const transformPath = nextTitle.toLowerCase();
      path.value = `/archives/${transformPath}`;
    },
  });
  const mainTrigger = bottomRef.value?.querySelector(".bottom-picture-wrap");
  const textTrigger = bottomRef.value?.querySelector("h3");

  tl.to(mainTrigger, { translateY: `${window.innerHeight * -0.5}px`, height: `${window.innerHeight}px` }, 0);
  tl.to(textTrigger, { opacity: 0 }, 0);
};

onMounted(async () => {
  lenisRef.value!.stop();

  setTimeout(() => {
    window.scrollTo(0, 0); // 브라우저 위치 초기화
  }, 50);

  await nextTick(init);
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
});
</script>

<template>
  <div ref="blurWrapRef" class="detail-wrap" :style="{ '--pictureWrapHeight': `${pictureWrapHeight}px` }">
    <article :id="`archive-${id}`">
      <div class="article-top">
        <div class="main-picture-wrap">
          <div class="picture-bg"></div>

          <Transition name="init">
            <div v-if="!isInit" class="init-wrap">
              <img :src="usePublicAsset(src)" :alt="title" />
            </div>
          </Transition>

          <img class="picture" :src="usePublicAsset(src)" :alt="title" />
        </div>

        <div ref="titleWrapRef" class="title-wrap">
          <h2>{{ title }}</h2>

          <ul>
            <li v-for="(svg, id) of icons" :key="`stack-${id}`">
              <Icon :name="svg.src" :size="isMobile ? 30 : 40" :class="['icon', svg.isActive && 'active']" />
            </li>
          </ul>
        </div>
      </div>

      <div v-for="(info, index) of data" :key="`info-${index}`" class="info-wrap">
        <div class="info-text">
          <time :datetime="info.date">{{ info.date }}</time>
          <p>{{ info.desc }}</p>
          <NuxtLink :to="info.link" target="_blank" :aria-detail="!!info?.link" :class="[!info?.link && 'disabled']">
            View Live
          </NuxtLink>
        </div>

        <slot v-if="info.content.length" :name="`info-${index}`"></slot>
      </div>
    </article>

    <article ref="bottomRef" class="bottom-section" :data-detail="true">
      <ArrowButton class="arrow-button" text="NEXT" @onClick="handleClickNextWrok" />

      <div role="button" class="bottom-picture-wrap" @click="handleClickNextWrok">
        <div class="picture-bg"></div>
        <img class="picture" :src="usePublicAsset(nextSrc)" :alt="nextTitle" />
        <h3>{{ nextTitle }}</h3>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.detail-wrap {
  .article-top {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100dvh;
    isolation: isolate;
    background-color: var(--gray);
    z-index: 1;

    .main-picture-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: stretch;
      width: 100%;
      height: var(--pictureWrapHeight);
      flex-shrink: 0;
      isolation: isolate;
      overflow: hidden;
      box-shadow: 0 0 0 1px var(--black);
      z-index: 1;

      .init-wrap {
        position: fixed;
        width: 100%;
        height: 100vh;
        background-color: var(--white);
        overflow: hidden;
        z-index: 99;

        &.init-leave-active {
          transition: height 1s ease-in-out;
        }
        &.init-leave-to {
          height: var(--pictureWrapHeight);
        }
      }

      .picture-bg {
        display: flex;
        position: absolute;
        inset: 0%;
        background-image: linear-gradient(var(--black), transparent 55%);
        pointer-events: none;
        user-select: none;
        z-index: 101;
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
        color: var(--black);
        line-height: 1.5;
      }

      ul {
        display: flex;
        gap: 18px;
        margin-bottom: 24px;

        li {
          display: flex;

          span {
            color: var(--icon-gray);

            &.active {
              color: var(--black);
            }
          }
        }
      }
    }
  }

  .info-wrap {
    padding-bottom: 250px;
    background-color: var(--gray);

    &:not(:last-child) {
      padding-bottom: 125px;
    }

    .info-text {
      text-align: center;

      time {
        font-size: 14px;
        color: var(--dark-gray);
        white-space: pre-wrap;
      }

      p {
        margin-block: 14px 24px;
        font-size: 18px;
        color: var(--black);
        white-space: pre-wrap;
      }

      a {
        position: relative;
        font-size: 24px;
        text-transform: uppercase;
        font-weight: bold;
        cursor: pointer;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 2px;
          background-color: currentColor;
          transform: scaleX(0);
          transition: transform 0.3s ease-in-out;
        }

        &:hover::after {
          transform: scaleX(1);
        }

        &.disabled {
          color: var(--icon-gray);
          pointer-events: none;
          user-select: none;

          &::after {
            top: 50%;
            bottom: auto;
            width: calc(100% + 10px);
            transform: translateY(-50%) scaleX(1);
          }
        }
      }
    }

    :deep(.sticky-wrap) {
      .media-container {
        display: inline-flex;
        flex-direction: column;

        .media {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          opacity: 0.9;
          filter: blur(8px) grayscale(0.5);
          transition: all 0.3s ease-in-out;

          figcaption {
            position: relative;
            padding: 6px 0 6px 2px;
            line-height: 1;
            font-size: 14px;
            color: var(--black);
          }

          small {
            position: absolute;
            left: 10px;
            top: 10px;
            line-height: 0.8;
            font-size: 12px;
            opacity: 0;
          }

          &.active {
            opacity: 1;
            filter: blur(0) grayscale(0);
          }
        }
      }

      article {
        margin: 100px auto 0;
        padding-inline: 20px;
      }
    }
  }

  .bottom-section {
    position: relative;
    cursor: pointer;
    background-color: var(--gray);

    :deep(.arrow-button) {
      padding-bottom: 20px;

      strong {
        line-height: 0.8;
        font-size: min(165px, 12.15278vw);
        color: var(--black);
      }

      svg {
        width: 154px;
        height: 130px;
        color: var(--black);
      }
    }

    .bottom-picture-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: stretch;
      height: 50dvh;
      width: 100%;
      min-height: 0;
      isolation: isolate;
      overflow: hidden;
      box-shadow: 0 0 0 1px var(--black);

      .picture-bg {
        display: flex;
        position: absolute;
        inset: 0%;
        background-image: linear-gradient(var(--black), transparent 55%);
        pointer-events: none;
        user-select: none;
        z-index: 1;
      }

      h3 {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 96px;
        color: var(--white);
        transform: translate(-50%, -50%);
        text-transform: uppercase;
        white-space: nowrap;
      }
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
}

@media screen and (max-width: 768px) {
  .detail-wrap {
    .article-top {
      .title-wrap {
        h2 {
          font-size: 56px;
        }
      }
    }

    .info-wrap {
      padding-bottom: 150px;

      .info-text {
        time {
          font-size: 12px;
        }
        p {
          font-size: 12px;
        }
        a {
          font-size: 16px;
        }
      }

      :deep(.sticky-wrap) {
        article {
          margin-top: 60px;
          padding-inline: 14px;

          .media-container {
            .media {
              figcaption {
                font-size: 10px;
              }
            }
          }
        }
      }
    }

    .bottom-section {
      :deep(.arrow-button) {
        strong {
          font-size: min(72px, 12.5vw);
          white-space: nowrap;
        }

        svg {
          flex-shrink: 0;
          width: 58px;
          height: 50px;
        }
      }

      .bottom-picture-wrap {
        h3 {
          font-size: 56px;
        }
      }
    }
  }
}
</style>
