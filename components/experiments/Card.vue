<script setup lang="ts">
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import usePublicAsset from "~/composables/usePublicAsset";

gsap.registerPlugin(SplitText);

const positions = [
  { x: 71, y: 58, w: 400, h: 270 },
  { x: 211, y: 255, w: 540, h: 360 },
  { x: 631, y: 158, w: 400, h: 270 },
  { x: 1191, y: 245, w: 260, h: 195 },
  { x: 351, y: 687, w: 260, h: 290 },
  { x: 751, y: 824, w: 205, h: 154 },
  { x: 911, y: 540, w: 260, h: 350 },
  { x: 1051, y: 803, w: 400, h: 300 },
  { x: 71, y: 922, w: 350, h: 260 },
];
const sources = [
  {
    src: "image-1.jpg",
    caption: "30 knots <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2021",
  },
  {
    src: "image-2.jpg",
    caption:
      "Sad Mis-Step <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024",
  },
  {
    src: "image-3.jpg",
    caption: "Mini Orange <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2014",
  },
  {
    src: "image-4.jpg",
    caption: "After Storm <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
  },
  {
    src: "image-5.jpg",
    caption: "Untitled <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2016",
  },
  {
    src: "image-6.jpg",
    caption:
      "Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
  },
  {
    src: "image-7.jpg",
    caption:
      "Cocoa Eggplant Tomato <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2025",
  },
  {
    src: "image-8.jpg",
    caption:
      "Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
  },
  {
    src: "image-9.jpg",
    caption:
      "Production Fun Fact (Eggs) <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024",
  },
];

const winW = window?.innerWidth;
const winH = window?.innerHeight;
const originalSize = { w: 1522, h: 1238 };
const tileSize = ref({
  w: winW,
  h: winW * (originalSize.h / originalSize.w),
});

const container = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const rafId = ref<number | null>(null);
const items = ref<any[]>([]);
const isDragging = ref(false);
const scroll = ref({
  ease: 0.06,
  current: { x: 0, y: 0 },
  target: { x: 0, y: 0 },
  last: { x: 0, y: 0 },
  delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } },
});
const drag = ref({ startX: 0, startY: 0, scrollX: 0, scrollY: 0 });
const mouse = ref({ x: { t: 0.5, c: 0.5 }, y: { t: 0.5, c: 0.5 }, press: { t: 0, c: 0 } });

const onResize = () => {
  scroll.value.current = { x: 0, y: 0 };
  scroll.value.target = { x: 0, y: 0 };
  scroll.value.last = { x: 0, y: 0 };

  if (container.value) container.value.innerHTML = "";

  const baseItems = positions.map((d, i) => {
    const scaleX = tileSize.value.w / originalSize.w;
    const scaleY = tileSize.value.h / originalSize.h;
    const source = sources[i % sources.length];
    return {
      src: source.src,
      caption: source.caption,
      x: d.x * scaleX,
      y: d.y * scaleY,
      w: d.w * scaleX,
      h: d.h * scaleY,
    };
  });

  const repsX = [0, tileSize.value.w];
  const repsY = [0, tileSize.value.h];

  baseItems.forEach((base) => {
    repsX.forEach((offsetX) => {
      repsY.forEach((offsetY) => {
        const el = document.createElement("div");
        el.classList.add("item");
        el.style.width = `${base.w}px`;

        const wrapper = document.createElement("div");
        wrapper.classList.add("item-wrapper");
        el.appendChild(wrapper);

        const itemImage = document.createElement("div");
        itemImage.classList.add("item-image");
        itemImage.style.width = `${base.w}px`;
        itemImage.style.height = `${base.h}px`;
        wrapper.appendChild(itemImage);

        const img = new Image();
        img.src = usePublicAsset(`/images/experiments/card/${base.src}`);
        itemImage.appendChild(img);

        const caption = document.createElement("small");
        caption.innerHTML = base.caption;

        wrapper.appendChild(caption);
        container.value?.appendChild(el);
        observer.value?.observe(caption);

        items.value.push({
          el,
          container: itemImage,
          wrapper,
          img,
          x: base.x + offsetX,
          y: base.y + offsetY,
          w: base.w,
          h: base.h,
          extraX: 0,
          extraY: 0,
          rect: el.getBoundingClientRect(),
          ease: Math.random() * 0.5 + 0.5,
        });
      });
    });
  });

  tileSize.value.w *= 2;
  tileSize.value.h *= 2;

  scroll.value.current.x = scroll.value.target.x = scroll.value.last.x = -winW * 0.1;
  scroll.value.current.y = scroll.value.target.y = scroll.value.last.y = -winH * 0.1;
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  const factor = 0.4;
  scroll.value.target.x -= e.deltaX * factor;
  scroll.value.target.y -= e.deltaY * factor;
};

const onMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  mouse.value.press.t = 1;
  drag.value.startX = e.clientX;
  drag.value.startY = e.clientY;
  drag.value.scrollX = scroll.value.target.x;
  drag.value.scrollY = scroll.value.target.y;
};

const onMouseUp = () => {
  isDragging.value = false;
  mouse.value.press.t = 0;
};

const onMouseMove = (e: MouseEvent) => {
  mouse.value.x.t = e.clientX / winW;
  mouse.value.y.t = e.clientY / winH;

  if (isDragging.value) {
    const dx = e.clientX - drag.value.startX;
    const dy = e.clientY - drag.value.startY;
    scroll.value.target.x = drag.value.scrollX + dx;
    scroll.value.target.y = drag.value.scrollY + dy;
  }
};

const render = () => {
  scroll.value.current.x += (scroll.value.target.x - scroll.value.current.x) * scroll.value.ease;
  scroll.value.current.y += (scroll.value.target.y - scroll.value.current.y) * scroll.value.ease;

  scroll.value.delta.x.t = scroll.value.current.x - scroll.value.last.x;
  scroll.value.delta.y.t = scroll.value.current.y - scroll.value.last.y;
  scroll.value.delta.x.c += (scroll.value.delta.x.t - scroll.value.delta.x.c) * 0.04;
  scroll.value.delta.y.c += (scroll.value.delta.y.t - scroll.value.delta.y.c) * 0.04;
  mouse.value.x.c += (mouse.value.x.t - mouse.value.x.c) * 0.04;
  mouse.value.y.c += (mouse.value.y.t - mouse.value.y.c) * 0.04;
  mouse.value.press.c += (mouse.value.press.t - mouse.value.press.c) * 0.04;

  const dirX = scroll.value.current.x > scroll.value.last.x ? "right" : "left";
  const dirY = scroll.value.current.y > scroll.value.last.y ? "down" : "up";

  items.value.forEach((item) => {
    const newX = 5 * scroll.value.delta.x.c * item.ease + (mouse.value.x.c - 0.5) * item.rect.width * 0.6;
    const newY = 5 * scroll.value.delta.y.c * item.ease + (mouse.value.y.c - 0.5) * item.rect.height * 0.6;
    const scrollX = scroll.value.current.x;
    const scrollY = scroll.value.current.y;
    const posX = item.x + scrollX + item.extraX + newX;
    const posY = item.y + scrollY + item.extraY + newY;

    const beforeX = posX > winW;
    const afterX = posX + item.rect.width < 0;
    if (dirX === "right" && beforeX) item.extraX -= tileSize.value.w;
    if (dirX === "left" && afterX) item.extraX += tileSize.value.w;

    const beforeY = posY > winH;
    const afterY = posY + item.rect.height < 0;
    if (dirY === "down" && beforeY) item.extraY -= tileSize.value.h;
    if (dirY === "up" && afterY) item.extraY += tileSize.value.h;

    const fx = item.x + scrollX + item.extraX + newX;
    const fy = item.y + scrollY + item.extraY + newY;
    item.el.style.transform = `translate(${fx}px, ${fy}px)`;
    item.img.style.transform = `scale(${1.2 + 0.2 * mouse.value.press.c * item.ease}) translate(${
      -mouse.value.x.c * item.ease * 10
    }%, ${-mouse.value.y.c * item.ease * 10}%)`;
  });

  scroll.value.last.x = scroll.value.current.x;
  scroll.value.last.y = scroll.value.current.y;

  rafId.value = requestAnimationFrame(render);
};

const initIntro = () => {
  if (!container.value) return;

  const itemWrappers = [...container.value?.querySelectorAll(".item-wrapper")];
  const introItems = itemWrappers.filter((item) => {
    const rect = item.getBoundingClientRect();
    return (
      rect.x > -rect.width &&
      rect.x < window?.innerWidth + rect.width &&
      rect.y > -rect.height &&
      rect.y < window?.innerHeight + rect.height
    );
  });
  introItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const x = -rect.x + window?.innerWidth * 0.5 - rect.width * 0.5;
    const y = -rect.y + window?.innerHeight * 0.5 - rect.height * 0.5;
    gsap.set(item, { x, y });
  });

  gsap.to(introItems.reverse(), {
    duration: 2,
    ease: "expo.inOut",
    x: 0,
    y: 0,
    stagger: 0.05,
  });
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  container.value?.addEventListener("mousedown", onMouseDown);

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  });

  onResize();
  render();
  initIntro();
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("mousemove", onMouseMove);
  container.value?.removeEventListener("mousedown", onMouseDown);
  window.removeEventListener("mouseup", onMouseUp);
  observer.value?.disconnect();

  if (rafId.value) cancelAnimationFrame(rafId.value);
});
</script>

<template>
  <section id="hero">
    <div ref="container" id="images"></div>
  </section>
</template>

<style>
:root {
  --curve: cubic-bezier(0.19, 1, 0.22, 1);
  --in-out: cubic-bezier(0.6, 0.14, 0, 1);
}

#hero {
  width: 100%;
  height: 100dvh;
  /* overflow: hidden; */

  #images {
    width: 100%;
    height: 100%;
    display: inline-block;
    white-space: nowrap;
    position: relative;

    .item {
      position: absolute;
      top: 0;
      left: 0;
      will-change: transform;
      white-space: normal;

      .item-wrapper {
        will-change: transform;
      }

      .item-image {
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform;
        }
      }

      small {
        display: block;
        font-size: 10px;
        line-height: 1.25;
        margin-top: 12px;

        .line-mask {
          transition: transform 2s var(--in-out);

          .line {
            transition: transform 2s var(--in-out);
          }
        }
      }

      small:not(.visible) {
        .line-mask {
          transform: translateY(100%);

          .line {
            transform: translateY(110%);
          }
        }
      }
    }
  }
}
</style>
