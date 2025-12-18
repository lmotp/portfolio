<script setup lang="ts">
import gsap from "gsap";

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
    scrollTrigger: {
      trigger: ".footer-wrapper",
      start: "bottom bottom",
      end: "max",
      scrub: true,
    },
  });

  scrollerTl.fromTo(
    ".footer-sticky-inner",
    {
      yPercent: 15,
    },
    {
      yPercent: 0,
    },
    0
  );
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
      <div class="logo-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1684 317" class="preloader__logo">
          <g
            class="logo__line"
            data-svg-origin="0 158.29700088500977"
            transform="matrix(1,0,0,1,0,0)"
            style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
          >
            <path d="M1684 113.277v90.04H0v-90.04h1684Z"></path>
          </g>
          <g class="logo__letter logo__letter--t" style="opacity: 1">
            <path
              class="logo__shape logo__shape--xy"
              d="M69.8047 0h95.9793v316.592H69.8047V0Z"
              data-svg-origin="117.79434967041016 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--xy"
              d="M235.586 0v90.0399H.001V0h235.585Z"
              data-svg-origin="117.79350335698109 45.01995086669922"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
          </g>
          <g class="logo__letter logo__letter--h" style="opacity: 1">
            <path
              class="logo__shape logo__shape--xy"
              d="M258.852 0h95.979v316.592h-95.979V0Z"
              data-svg-origin="306.84149169921875 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--xy"
              d="M415.907 0h95.979v316.592h-95.979V0Z"
              data-svg-origin="463.8965148925781 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
          </g>
          <g class="logo__letter logo__letter--e" style="opacity: 1">
            <path
              class="logo__shape logo__shape--xy"
              d="M535.156 0h95.979v316.592h-95.979V0Z"
              data-svg-origin="583.1455078125 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--y"
              d="M735.842 226.551v90.04H535.158v-90.04h200.684Z"
              data-svg-origin="635.5000305175781 271.5709991455078"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--y"
              d="M735.842 0v90.0399H535.158V0h200.684Z"
              data-svg-origin="635.5000305175781 45.01995086669922"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
          </g>
          <g class="logo__letter logo__letter--l" style="opacity: 1">
            <path
              class="logo__shape logo__shape--x"
              d="M852.18 0h95.979v316.592H852.18V0Z"
              data-svg-origin="900.1694946289062 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--y"
              d="M1035.41 226.551v90.04H852.177v-90.04h183.233Z"
              data-svg-origin="943.7935180664062 271.5709991455078"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
          </g>
          <g class="logo__letter logo__letter--i" style="opacity: 1">
            <path
              class="logo__shape logo__shape--xy"
              d="M1058.68 0h95.98v316.592h-95.98V0Z"
              data-svg-origin="1106.6700439453125 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
          </g>
          <g class="logo__letter logo__letter--n" style="opacity: 1">
            <path
              class="logo__shape logo__shape--xy"
              d="M1177.93 0h95.98v316.592h-95.98V0Z"
              data-svg-origin="1225.9200439453125 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--xy"
              d="M1177.93 0h95.98l186.14 316.592h-95.98L1177.93 0Z"
              data-svg-origin="1318.9900512695312 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--xy"
              d="M1364.07 0h95.98v316.592h-95.98V0Z"
              data-svg-origin="1412.0599365234375 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
          </g>
          <g class="logo__letter logo__letter--e" style="opacity: 1">
            <path
              class="logo__shape logo__shape--xy"
              d="M1483.31 0h95.98v316.592h-95.98V0Z"
              data-svg-origin="1531.300048828125 158.29600524902344"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--y"
              d="M1684 226.551v90.04h-200.68v-90.04H1684Z"
              data-svg-origin="1583.6600341796875 271.5709991455078"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
            <path
              class="logo__shape logo__shape--y"
              d="M1684 0v90.0399h-200.68V0H1684Z"
              data-svg-origin="1583.6600341796875 45.01995086669922"
              transform="matrix(1,0,0,1,0,0)"
              style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px"
            ></path>
          </g>
        </svg>
      </div>
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
    background-color: #e8e8e8;
    z-index: 1;

    h2 {
      line-height: 0.8;
      letter-spacing: -6px;
      font-size: 165px;
      font-weight: 700;
    }
  }

  .footer-wrapper {
    position: relative;
    width: 100%;
    padding: 324px 8px 8px;
    background-color: #e8e8e8;
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
        background-color: #ff391e;

        figure {
          position: absolute;
          left: 29%;
          bottom: 0;
          width: 487px;
          mix-blend-mode: multiply;
          pointer-events: none;
          filter: grayscale(0.3);
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
  }
}
</style>
