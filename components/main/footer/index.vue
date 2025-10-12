<script setup lang="ts">
import gsap from "gsap";

const init = () => {
  const wrapperTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".footer-wrapper",
      start: "top top",
      end: "max",
      scrub: true,
    },
  });

  wrapperTl.to(
    ".footer-wrapper",
    {
      xPercent: -7,
      rotate: -6,
      transformOrigin: "top left",
      ease: "power1.inOut",
    },
    0
  );

  const scrollerTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".footer-wrapper",
      start: "bottom bottom",
      end: "max",
      scrub: true,
    },
  });

  scrollerTl.fromTo(".footer-sticky-inner", { yPercent: 15 }, { yPercent: 0 }, 0);
};
onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <footer>
    <div class="footer-wrapper"></div>
    <div class="footer-scroller">
      <div class="footer-sticky">
        <div class="footer-sticky-inner">
          <figure>
            <picture>
              <img
                src="https://www.datocms-assets.com/136821/1728381584-tshirtillustrationfinals_v05.png?fit=crop&fm=webp&w=900"
                alt=""
              />
            </picture>
          </figure>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 385px;
  width: 100%;
  isolation: isolate;

  .footer-wrapper {
    width: 100%;
    height: 100dvh;
    background-color: #e8e8e8;
  }

  .footer-scroller {
    position: absolute;
    inset: 0;
    z-index: -1;

    .footer-sticky {
      position: sticky;
      top: 0;
      height: 100dvh;

      .footer-sticky-inner {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: flex-end;
        background-color: red;

        figure {
          position: absolute;
          left: 30%;
          bottom: 15px;
          width: 375px;
          mix-blend-mode: multiply;
          pointer-events: none;
          filter: grayscale(0.3);
        }
      }
    }
  }
}
</style>
