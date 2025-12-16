<script setup lang="ts">
import gsap from "gsap";

const init = () => {
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".outro-intro",
      start: "top bottom",
      end: "top center",
      scrub: true,
    },
  });
  const subTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".outro-intro",
      start: "top 35%",
      end: "bottom top-=50%",
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
    },
    0
  );

  subTl.to(
    ".outro-intro",
    {
      xPercent: -10,
      rotate: -4,
      yPercent: 5,
      transformOrigin: "right",
      ease: "power1.out",
    },
    0
  );
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <div class="outro-intro">
    <div class="intro-wrapper">
      <div class="title-wrap">
        <strong>
          <span class="fw300">/&nbsp;</span>
          About The Line
        </strong>

        <h2>Highlights</h2>
      </div>

      <div class="link-wrap">
        <a href="#" class="link">T1</a>
        <a href="#" class="link">T2</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outro-intro {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    height: 100lvh;
    background-color: #f8f8f8;
  }

  .intro-wrapper {
    position: relative;
    padding-inline: 6px;
    background-color: #f8f8f8;

    .title-wrap {
      padding: 6px 6px 0;
      color: #0b0d0f;

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

    .link-wrap {
      display: flex;
      gap: 26px;
      padding-block: 50px 8px;
    }
  }
}

@media screen and (max-width: 768px) {
  .outro-intro .intro-wrapper .title-wrap {
    padding-top: 0;
  }
}
</style>
