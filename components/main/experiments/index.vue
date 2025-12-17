<script setup lang="ts">
import gsap from "gsap";
import usePublicAsset from "~/composables/usePublicAsset";

const source = [
  [
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/1.webp",
      pixelSrc: "/images/skills/1_pixel.png",
    },
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/2.webp",
      pixelSrc: "/images/skills/2_pixel.png",
    },
  ],
  [
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/3.webp",
      pixelSrc: "/images/skills/3_pixel.png",
    },
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/0.webp",
      pixelSrc: "/images/skills/0_pixel.png",
    },
  ],
  [
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/5.webp",
      pixelSrc: "/images/skills/5_pixel.png",
    },
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/6.webp",
      pixelSrc: "/images/skills/6_pixel.png",
    },
  ],
];

const skillsRef = ref<HTMLElement | null>(null);
const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);

const init = () => {
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".skills-intro",
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

const rotateInit = () => {
  if (!skillsRef.value) return;

  const rows = skillsRef.value.querySelectorAll(".row");
  rows.forEach((row, i) => {
    const skills = row.querySelectorAll(".skill-wrap");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 80%",
      },
    });

    tl.fromTo(
      skills,
      {
        y: 1000,
        rotation: (index) => (index % 2 === 0 ? -60 : 60),
        transformOrigin: "center center",
      },
      {
        y: 0,
        rotation: 0,
        duration: 1,
        stagger: 0.25,
        ease: "power4.out",
      },
      isMobile.value ? ">+=0.3" : ""
    );
  });
};

onMounted(() => {
  nextTick(() => {
    init();
    rotateInit();
  });
});
</script>

<template>
  <div class="skills-intro">
    <div class="intro-wrapper">
      <div class="title-wrap">
        <strong>
          <span class="fw300">/&nbsp;</span>
          About The Line
        </strong>

        <h2>Experiments</h2>
      </div>

      <div ref="skillsRef" class="skills">
        <div class="row" v-for="(wrap, i) of source" :key="`wrap-${i}`">
          <div class="skill-wrap" v-for="(value, j) of wrap" :key="`value-${j}`">
            <figure>
              <img class="main" :src="usePublicAsset(value.src)" alt="" />
              <img class="pixel" :src="usePublicAsset(value.pixelSrc)" alt="" />
            </figure>

            <p class="text-wrap">
              <strong>{{ value.content }}</strong>
              <span>{{ value.title }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-intro {
  margin-top: -25dvh;
  isolation: isolate;

  .intro-wrapper {
    position: relative;
    padding-inline: 6px;
    background-color: #f8f8f8;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 100%;
      width: 100%;
      height: 100lvh;
      background-color: #f8f8f8;
    }

    .title-wrap {
      padding: 6px 6px 0;
      color: #0b0d0f;

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

    .skills {
      position: relative;
      padding: 50px 8px 150px;
      background: linear-gradient(#f8f8f8, #e8e8e8);
      z-index: 1;
      overflow: hidden;

      .row {
        display: flex;

        .skill-wrap {
          width: 50%;
          padding: 0 8px 16px;
          cursor: pointer;

          figure {
            position: relative;
            width: 100%;
            isolation: isolate;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              object-position: center;
              object-fit: cover;
              transform: scale(1.2);
              image-rendering: pixelated;
              pointer-events: none;

              transition: all 0.3s ease;

              &.main {
                opacity: 0;
                z-index: 5;
              }

              &.pixel {
                z-index: 4;
              }
            }

            &::after {
              content: "";
              display: block;
              width: 100%;
              padding-bottom: 66.8103448276%;
            }

            &:hover {
              img {
                transform: scale(1);

                &.main {
                  opacity: 1;
                }
                &.pixel {
                  opacity: 0;
                }
              }
            }
          }

          .text-wrap {
            display: flex;
            flex-direction: column;
            margin-top: 8px;

            span {
              font-size: 12px;
              color: #999;
            }

            strong {
              color: #0b0d0f;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .skills-intro .intro-wrapper {
    .title-wrap {
      h2 {
        font-size: 72px;
      }
    }
    .skills .row {
      flex-direction: column;

      .skill-wrap {
        width: min(100%, 600px);
        padding-inline: 0;

        &:nth-child(odd) {
          margin-right: auto;
        }
        &:nth-child(even) {
          margin-left: auto;
        }

        figure::after {
          padding-bottom: 50%;
        }
      }
    }
  }
}
</style>
