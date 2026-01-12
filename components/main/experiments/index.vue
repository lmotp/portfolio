<script setup lang="ts">
import gsap from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";
import { experimentsData } from "~/utils/data";

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const linkData = computed(() => experimentsData.map((v) => v.title));
const mouseThumbnail = ref("");

const init = () => {
  const mainTl = gsap.timeline({
    id: "main-experiments",
    scrollTrigger: {
      trigger: ".experiments",
      start: "top bottom",
      end: "top center",
      scrub: true,
    },
  });

  mainTl.fromTo(
    ".intro-wrapper",
    {
      xPercent: -10,
      rotate: 8,
      transformOrigin: "left",
    },
    {
      xPercent: 0,
      rotate: 0,
    }
  );
};

const handleClickRouter = (menuPath: string) => {
  const transformPath = menuPath.toLowerCase();
  transformPath === path.value ? null : (path.value = `/experiments/${transformPath}`);
};
const handleMouseEnter = (src: string) => {
  mouseThumbnail.value = usePublicAsset(src);
};

onMounted(async () => {
  await nextTick(init);
});
</script>

<template>
  <section class="experiments">
    <div class="intro-wrapper">
      <div class="title-wrap">
        <strong>/ About The Line </strong>
        <h2>EXPERIMENTS</h2>
      </div>

      <div class="link-wrap">
        <button v-for="(data, index) of linkData" :key="`data-${index}`" @click="handleClickRouter(data)" class="link">
          {{ data }}
        </button>
      </div>
    </div>

    <div class="content">
      <ul>
        <li
          v-for="(data, index) of experimentsData"
          :key="`experiments-${index}`"
          @mouseenter="handleMouseEnter(data.src)"
        >
          <button :data-experiments-index="index" :data-detail="true" @click="handleClickRouter(data.title)">
            <p>
              <strong>{{ data.title }}</strong>
              <span>{{ data.content }}</span>
            </p>

            <img :src="usePublicAsset(data.pixelSrc)" :alt="data.title" />
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.experiments {
  position: relative;
  margin-top: -25dvh;
  padding-bottom: 250px;
  isolation: isolate;

  .intro-wrapper {
    position: relative;
    padding: 0 6px 25dvh;
    background-color: var(--gray);

    .title-wrap {
      padding-top: 6px;
      color: var(--black);

      strong {
        display: flex;
        font-size: 10px;
        margin-bottom: 20px;
      }

      h2 {
        line-height: 0.8;
        letter-spacing: -6px;
        font-size: 165px;
        font-weight: 700;
      }
    }

    .link-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 26px;
      padding: 50px 10px 8px;
      color: var(--black);

      .link {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background-color: black;
          transform: scaleX(0);
          transition: transform 0.3s ease-in-out;
        }

        &:hover::after {
          transform: scaleX(1);
        }
      }
    }
  }

  .content {
    ul {
      display: flex;
      flex-direction: column;

      li {
        position: relative;
        width: 100%;
        color: var(--black);
        background-color: var(--gray);
        transition: background-color 0.3s ease-out, color 0.3s ease-in-out;

        &:hover {
          color: var(--white);
          background-color: var(--blue);
        }

        &::after {
          content: "";
          position: absolute;
          inset: 0;
          border-bottom: 1px solid var(--black);
          pointer-events: none;
          user-select: none;
        }

        &:first-child::after {
          border-top: 1px solid var(--black);
        }

        button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          padding: 28px 50px 28px 18px;
          width: 100%;

          p {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;

            strong {
              font-size: clamp(28px, 4vw, 42px);
            }
            span {
              color: var(--dark-gray);
              font-size: 14px;
            }
          }
          img {
            width: 50px;
            aspect-ratio: 1;
          }
        }
      }
    }
  }

  .mouse-thumbnail {
    pointer-events: none;
    user-select: none;
    background-color: red;

    img {
      width: 300px;
      aspect-ratio: 16 / 9;
    }
  }
}

@media screen and (max-width: 768px) {
  .experiments {
    padding-bottom: 150px;

    .intro-wrapper {
      padding-bottom: 15dvh;

      .title-wrap {
        h2 {
          font-size: min(72px, 12.5vw);
        }
      }
    }

    .content ul li {
      button p {
        span {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
