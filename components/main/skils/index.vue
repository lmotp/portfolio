<script setup lang="ts">
import gsap from "gsap";

const skilCard = [
  { title: "Web Design", type: "image", src: "" },
  { title: "Web Design", type: "image", src: "" },
  { title: "Web Design", type: "image", src: "" },
  { title: "Web Design", type: "image", src: "" },
];

const cardWrapRef = ref<HTMLElement | null>(null);

const init = () => {
  if (!cardWrapRef.value) return;

  const cards = [...cardWrapRef.value.querySelectorAll(".card")];
  const positions = [14, 38, 62, 86];
  const firstRotationZs = [-9, -3, 3, 9];
  const secondRotationZs = [-13, -4, 4, 13];

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cardWrapRef.value,
      start: `top+=${window.innerHeight} top`,
      end: () => `+=${window.innerHeight * 3}`,
      scrub: 1,
    },
    defaults: {
      overwrite: "auto",
    },
  });

  tl.to(cards, {
    rotateZ: (index) => firstRotationZs[index],
    duration: 1.5,
    ease: "power1.out",
  });
  tl.to(cards, {
    left: (index) => `${positions[index]}%`,
    rotateZ: (index) => secondRotationZs[index],
    duration: 1.5,
    ease: "expo.out",
  });
  tl.to(cards, { rotateZ: 0, rotateY: -17, stagger: 0.3, ease: "back.out", duration: 3 });
  tl.to(cards, { rotateY: 0, stagger: 0.25, ease: "back.out" });
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div class="skills">
    <div class="sticky-wrap">
      <div class="title-wrap">
        <strong>
          <span class="fw300">/&nbsp;</span>
          Make Your Mark
        </strong>

        <h2>Skills</h2>
      </div>

      <div ref="cardWrapRef" class="card-wrap">
        <div class="card-perspective">
          <div class="card" v-for="(_, index) in skilCard" :key="index" :style="{ animationDelay: `${index * 0.2}s` }">
            <div class="front"></div>
            <div class="back"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills {
  position: relative;
  margin-top: -200dvh;
  width: 100%;
  height: 600dvh;
  background-color: blue;
  z-index: -2;

  .sticky-wrap {
    position: sticky;
    top: 15px;
    height: 100dvh;

    .title-wrap {
      position: absolute;
      top: 0;
      left: 0;
      padding: 6px 6px 0;
      color: #ffffff;

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

    .card-wrap {
      position: relative;
      height: calc(100% - 30px);

      .card-perspective {
        width: 100%;
        height: 100%;
        perspective: 1000px;
        perspective-origin: center center;

        .card {
          --offsetY: 10px;

          position: absolute;
          top: 50%;
          left: 50%;
          width: 302px;
          aspect-ratio: 314 / 438;
          transform-style: preserve-3d;
          transform: translate(-50%, -50%) rotateY(180deg);

          .front {
            position: absolute;
            inset: 0;
            background-color: white;
            border-radius: 15px;
            backface-visibility: hidden;
          }

          .back {
            position: absolute;
            inset: 0;
            background-color: white;
            background-image: url("https://lusion.co/assets/images/cards/back.png");
            background-size: contain;
            border-radius: 15px;
            backface-visibility: hidden;
            transform: rotateY(180deg);
          }
        }
      }
    }
  }
}
</style>
