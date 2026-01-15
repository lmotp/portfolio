<script setup lang="ts">
import gsap from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";
import { sideMenuData } from "~/utils/data";

import LineLogo from "../LineLogo.vue";

const pageTransitionStore = usePageTransitionStore();
const { path } = storeToRefs(pageTransitionStore);

const isMobile = ref(window.innerWidth === 0 ? null : window.innerWidth <= 768);
const footerCreditsRef = ref<HTMLElement | null>(null);
const footerGridRef = ref<HTMLElement | null>(null);
const footerPaddingBottom = ref(0);
const archives = computed(() => sideMenuData.Archives.childs.map((v) => ({ name: v.name, path: v.path })));
const experiments = computed(() => sideMenuData.Experiments.childs.map((v) => ({ name: v.name, path: v.path })));
const skills = ["VUE", "NUXT", "GSAP", "CHARTJS", "THREEJS", "STORYBOOK"];

const init = () => {
  if (!footerCreditsRef.value || !footerGridRef.value) return;

  const OFFSET = 15;
  const { height } = isMobile.value
    ? footerGridRef.value.getBoundingClientRect()
    : footerCreditsRef.value.getBoundingClientRect();
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

const handleClickRouter = (menuPath: string) => {
  menuPath === path.value ? null : (path.value = menuPath);
};

onMounted(() => {
  nextTick(init);
});
</script>

<template>
  <footer :style="{ paddingBottom: `${footerPaddingBottom}px` }">
    <div class="footer-gutter">
      <ArrowButton class="arrow-button" text="Let's Talk" />
    </div>

    <div class="footer-wrapper">
      <LineLogo />
    </div>

    <div class="footer-scroller">
      <div class="footer-sticky">
        <div class="footer-sticky-inner">
          <div ref="footerGridRef" class="footer-grid">
            <div class="info-wrap">
              <strong>/ Contact </strong>

              <p>
                <a href="mailto:unoeye22@gmail.com">unoeye22@gmail.com</a><br />
                <em>/</em>
                <a href="tel:01054086369">010 5408 6369</a><br />
                <em>/</em>
                <a href="https://github.com/lmotp">GitHub</a>
              </p>
            </div>

            <div class="archives menu-wrap">
              <strong>/ Archives</strong>
              <ul>
                <li v-for="(data, index) of archives" :key="`archive-${index}`">
                  <button @click="handleClickRouter(data.path)">{{ data.name }}</button>
                </li>
              </ul>
            </div>

            <div class="experiments menu-wrap">
              <strong>/ Experiments</strong>
              <ul>
                <li v-for="(data, index) of experiments" :key="`experiment-${index}`">
                  <button @click="handleClickRouter(data.path)">{{ data.name }}</button>
                </li>
              </ul>
            </div>

            <div v-if="!isMobile" class="bottom-wrap">
              <p>사카낙션(サカナクション)은 일본어 '물고기(魚, 사카나)'와 영어 '액션(Action)'</p>
              <div class="skills-wrap">
                <strong>/ Skills</strong>
                <ul>
                  <li v-for="(data, index) of skills" :key="`skill-${index}`">#{{ data }}</li>
                </ul>
              </div>
            </div>

            <figure>
              <picture>
                <img src="@/public/images/footer/1728381584-tshirtillustrationfinals_v05.avif" alt="" />
              </picture>
            </figure>
          </div>
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

    :deep(.arrow-button) {
      strong {
        line-height: 0.8;
        font-size: min(165px, 12.15278vw);
        color: var(--black);
      }

      svg {
        width: 154px;
        height: 130px;
        color: var(--black);
      }
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

        .footer-grid {
          position: relative;
          top: 1px;
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          column-gap: 10px;
          padding: 0 10px 10px;
          width: 100%;
          color: var(--white);
          isolation: isolate;

          .info-wrap {
            grid-column: 1 / span 3;

            p {
              font-size: 35px;
              line-height: 1.25;
              text-transform: uppercase;

              em {
                margin-right: 10px;
              }
              a {
                transition: opacity 0.25s ease-in-out;

                &:has(~ a:hover),
                &:hover ~ a {
                  opacity: 0.5;
                }
                &:hover {
                  opacity: 1;
                }
              }
            }

            strong {
              display: flex;
              font-size: 14px;
              margin-bottom: 20px;
              border-bottom: 1px solid var(--white);
            }
          }

          .menu-wrap {
            display: flex;
            flex-direction: column;

            &.archives {
              grid-column: 7 / span 1;
            }
            &.experiments {
              grid-column: 8 / span 2;

              ul {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                column-gap: 10px;
              }
            }

            ul {
              li {
                transition: opacity 0.25s ease-in-out;

                &:has(~ li:hover),
                &:hover ~ li {
                  opacity: 0.5;
                }
                &:hover {
                  opacity: 1;
                }

                button {
                  font-size: 22px;
                }
              }
            }

            strong {
              font-size: 14px;
              margin-bottom: 20px;
              border-bottom: 1px solid var(--white);
            }
          }

          .bottom-wrap {
            grid-column: 1 / span 9;
            padding: 130px 0 6px;

            p {
              font-size: 24px;
              text-align: right;
            }

            .skills-wrap {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              gap: 10px;

              strong {
                font-size: 14px;
              }

              ul {
                display: flex;
                gap: 6px;

                li {
                  font-size: 24px;
                }
              }
            }
          }

          figure {
            position: absolute;
            left: 35%;
            bottom: 0;
            width: 486px;
            mix-blend-mode: multiply;
            pointer-events: none;
          }
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
      padding-top: 275px;
    }
    .footer-scroller .footer-sticky .footer-sticky-inner .footer-grid {
      .info-wrap {
        p {
          font-size: clamp(16px, 1.85185vw, 26px);
          line-height: 1.25;
        }

        strong {
          font-size: 10px;
          margin-bottom: 20px;
        }
      }

      .menu-wrap {
        &.experiments {
          ul {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 10px;
          }
        }

        ul {
          button {
            font-size: clamp(10px, 1.15741vw, 16px);
          }
        }

        strong {
          font-size: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--white);
        }
      }

      .bottom-wrap {
        padding: 130px 0 6px;

        p {
          font-size: 16px;
        }

        .skills-wrap {
          gap: 10px;

          strong {
            font-size: 10px;
          }

          ul {
            display: flex;
            gap: 6px;

            li {
              font-size: 16px;
            }
          }
        }
      }

      figure {
        width: clamp(325px, 30vw, 375px);
        left: 30%;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  footer {
    .footer-gutter {
      padding: 18px 8px 0;

      :deep(.arrow-button) {
        strong {
          font-size: min(72px, 12.5vw);
          white-space: nowrap;
        }
        svg {
          flex-shrink: 0;
          width: 58px;
          height: 50px;
        }
      }
    }

    .footer-wrapper {
      padding-top: 200px;
    }

    .footer-scroller {
      .footer-sticky .footer-sticky-inner .footer-grid {
        grid-template-columns: 1fr;
        gap: 0 8px;
        padding-inline: 8px;

        & > * {
          grid-column: auto !important;
        }

        .info-wrap {
          padding-bottom: 30px;

          p {
            font-size: 24px;
            line-height: 0.95;
          }
        }

        .menu-wrap {
          margin-bottom: 16px;

          ul li {
            button {
              font-size: 16px;
            }
          }
        }

        .bottom-wrap {
          padding-block: 48px 0;
        }

        figure {
          left: 20%;
          opacity: 0.2;
          width: 138.46154vw;
        }
      }
      .footer-credits {
        height: 100dvh;
      }
    }
  }
}
</style>
