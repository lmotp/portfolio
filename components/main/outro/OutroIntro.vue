<script setup lang="ts">
import gsap from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";
import { archivesData } from "~/utils/data";

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const linkData = computed(() => archivesData.map((v) => v.title));

const init = () => {
  const mainTl = gsap.timeline({
    id: "outro-intro-main",
    scrollTrigger: {
      trigger: ".outro-intro",
      start: "top bottom",
      end: "top center",
      scrub: true,
    },
  });
  const subTl = gsap.timeline({
    id: "outro-intro-sub",
    scrollTrigger: {
      trigger: ".outro-intro",
      start: "top 35%",
      end: "bottom top-=50%",
      scrub: true,
    },
  });

  mainTl.fromTo(
    ".outro-intro-wrapper",
    {
      xPercent: -10,
      rotate: 8,
      transformOrigin: "left",
    },
    {
      xPercent: 0,
      rotate: 0,
    },
    0
  );

  subTl.to(
    ".outro-intro",
    {
      xPercent: isMobile.value ? 0 : -10,
      rotate: isMobile.value ? 0 : -4,
      yPercent: isMobile.value ? 0 : 5,
      transformOrigin: "right",
      ease: "power1.out",
    },
    0
  );
};

const handleClickRouter = (menuPath: string) => {
  const transformPath = menuPath.toLowerCase();
  transformPath === path.value ? null : (path.value = `/archives/${transformPath}`);
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div class="outro-intro">
    <div class="outro-intro-wrapper">
      <div class="title-wrap">
        <strong>
          <span class="fw300">/&nbsp;</span>
          About The Line
        </strong>

        <h2>ARCHIVES</h2>
      </div>

      <div class="link-wrap">
        <button
          v-for="(data, index) of linkData"
          :key="`data-${index}`"
          @click="handleClickRouter(data.toLowerCase())"
          class="link"
        >
          {{ data }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outro-intro {
  position: relative;

  &::after {
    background-color: var(--white);
    content: "";
    height: 100dvh;
    left: 0;
    position: absolute;
    top: 100%;
    width: 100%;
  }

  .outro-intro-wrapper {
    position: relative;
    padding-inline: 6px;
    background-color: var(--white);

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
      gap: 26px;
      padding-block: 50px 8px;
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
}

@media screen and (max-width: 768px) {
  .outro-intro .outro-intro-wrapper .title-wrap {
    h2 {
      font-size: 72px;
    }
  }
}
</style>
