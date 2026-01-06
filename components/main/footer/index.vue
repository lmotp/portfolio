<script setup lang="ts">
import gsap from "gsap";
import LineLogo from "../LineLogo.vue";

const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const footerCreditsRef = ref<HTMLElement | null>(null);
const footerPaddingBottom = ref(0);

const init = () => {
  if (!footerCreditsRef.value) return;

  const OFFSET = 8;
  const { height } = footerCreditsRef.value.getBoundingClientRect();
  footerPaddingBottom.value = OFFSET + height;

  if (!isMobile.value) {
    const wrapperTl = gsap.timeline({
      id: "footer-wrapper",
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
  }

  const scrollerTl = gsap.timeline({
    id: "footer-scroller",
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
  <footer :style="{ paddingBottom: `${footerPaddingBottom}px` }">
    <div class="footer-gutter">
      <h2>Contact</h2>
    </div>

    <div class="footer-wrapper">
      <LineLogo />
    </div>

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
      <div ref="footerCreditsRef" class="footer-credits"></div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  position: relative;
  overflow: clip;
  isolation: isolate;

  .footer-gutter {
    position: relative;
    padding: 18px 4px 0;
    background-color: var(--gray);
    z-index: 1;

    h2 {
      line-height: 0.8;
      letter-spacing: -6px;
      font-size: 165px;
      font-weight: 700;
      color: var(--black);
    }
  }

  .footer-wrapper {
    position: relative;
    width: 100%;
    padding: 324px 8px 8px;
    background-color: var(--gray);
    color: var(--black);
  }

  .footer-scroller {
    position: absolute;
    inset: -50vh 0 0 0;
    z-index: -1;

    .footer-sticky {
      position: sticky;
      top: 0;
      display: flex;
      height: 100dvh;
      transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);

      .footer-sticky-inner {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: flex-end;
        background-color: var(--dark-blue);

        figure {
          position: absolute;
          left: 30%;
          bottom: 0;
          width: 486px;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
      }
    }
    .footer-credits {
      height: 50lvh;
    }
  }
}

@media screen and (max-width: 1440px) {
  footer {
    .footer-wrapper {
      padding-top: 250px;
    }

    .footer-scroller {
      .footer-sticky .footer-sticky-inner figure {
        width: 375px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  footer {
    .footer-gutter {
      padding: 18px 8px 0;

      h2 {
        font-size: 72px;
      }
    }

    .footer-scroller {
      .footer-sticky .footer-sticky-inner figure {
        left: 20.51282vw;
        opacity: 0.2;
        width: 138.46154vw;
      }
    }
  }
}
</style>
