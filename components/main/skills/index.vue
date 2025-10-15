<script setup lang="ts">
import gsap from "gsap";

const source = [
  [
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/1.webp",
    },
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/2.webp",
    },
  ],
  [
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/3.webp",
    },
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/4.webp",
    },
  ],
  [
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/5.webp",
    },
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/6.webp",
    },
  ],
  [
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/7.webp",
    },
    {
      title: "WebGL / OGL",
      content: "Progressive Blur",
      src: "/images/skills/8.webp",
    },
  ],
];
const skillsRef = ref<HTMLElement | null>(null);

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
        start: "top 60%",
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
      }
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

        <h2>Skills</h2>
      </div>
    </div>

    <div ref="skillsRef" class="skills">
      <div class="row" v-for="(wrap, i) of source" :key="`wrap-${i}`">
        <div class="skill-wrap" v-for="(value, j) of wrap" :key="`value-${j}`">
          <figure>
            <img :src="value.src" alt="" />
          </figure>

          <p class="text-wrap">
            <strong>{{ value.content }}</strong>
            <span>{{ value.title }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-intro {
  margin-top: -75dvh;
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

      @media (max-width: 1000px) {
        padding-top: 0;
      }

      strong {
        display: flex;
        font-size: 10px;
        margin-bottom: 20px;
      }

      h2 {
        line-height: 1;
        letter-spacing: -7px;
        font-size: 175px;
        font-weight: 700;
      }
    }
  }

  .skills {
    position: relative;
    padding: 50px 8px 0;
    background: linear-gradient(#f8f8f8, #e8e8e8);
    z-index: 1;

    .row {
      display: flex;

      .skill-wrap {
        width: 50%;
        padding: 0 8px 16px;

        figure {
          position: relative;
          width: 100%;

          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            object-fit: cover;
            object-position: center;
          }

          &::after {
            content: "";
            display: block;
            width: 100%;
            padding-bottom: 66.8103448276%;
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
</style>
