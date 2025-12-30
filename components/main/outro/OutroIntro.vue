<script setup lang="ts">
import gsap from "gsap";

const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);

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
    background-color: #f8f8f8;
    content: "";
    height: 100lvh;
    left: 0;
    position: absolute;
    top: 100%;
    width: 100%;
  }

  .outro-intro-wrapper {
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
