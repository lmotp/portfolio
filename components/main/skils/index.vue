<script setup>
import gsap from "gsap";

const skilCard = [
  { title: "Web Design", type: "image", src: "" },
  { title: "Web Design", type: "image", src: "" },
  { title: "Web Design", type: "image", src: "" },
  { title: "Web Design", type: "image", src: "" },
];

const init = () => {
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".skills",
      start: "top bottom",
      end: "top center",
      scrub: true,
      pin: true,
    },
  });
};

onMounted(() => {});
</script>

<template>
  <div class="skills">
    <div class="title-wrap">
      <strong>
        <span class="fw300">/&nbsp;</span>
        Make Your Mark
      </strong>

      <h2>Skills</h2>
    </div>

    <div class="card-wrap">
      <div class="card-perspective">
        <div class="card" v-for="(item, index) in skilCard" :key="index">
          <div class="front"></div>
          <div class="back"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: hotpink;
  z-index: -2;

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

  .card-wrap {
    position: relative;

    .card-perspective {
      width: 100%;
      perspective: 1vh;
      perspective-origin: center center;

      .card {
        position: absolute;
        top: 0;
        left: 0;
        width: 302px;
        aspect-ratio: 314 / 438;
        transform-style: preserve-3d;

        .front {
          position: absolute;
          inset: 0;
          border-radius: 15px;
          backface-visibility: hidden;
        }

        .back {
          position: absolute;
          inset: 0;
          background-image: url("https://lusion.co/assets/images/cards/back.png");
          border-radius: 15px;
          backface-visibility: hidden;
        }
      }
    }
  }
}
</style>
