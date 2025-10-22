<script setup lang="ts">
import * as rive from "@rive-app/canvas";
import gsap from "gsap";
import { usePageTransitionStore } from "@/stores/pageTransition";
import { storeToRefs } from "pinia";

const router = useRouter();

const pageTransitionStore = usePageTransitionStore();
const { isPageTransition, path } = storeToRefs(pageTransitionStore);
const pushRequested = ref(false);
let transitionInput: rive.StateMachineInput;
let r: rive.Rive;

const init = () => {
  r = new rive.Rive({
    src: "/rive/navigate_ui_transition_desktop_scroll.riv",
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    autoplay: true,
    stateMachines: "Transition Desktop",
    layout: new rive.Layout({
      fit: rive.Fit.Cover,
      alignment: rive.Alignment.Center,
    }),
    onLoad: () => {
      transitionInput = r.stateMachineInputs("Transition Desktop")[0];
      transitionInput.value = 5;
      r.resizeDrawingSurfaceToCanvas();
      r.play();
    },
  });
};

watch(path, (url) => {
  isPageTransition.value = true;
  transitionInput.value = 10;

  gsap.to(transitionInput, {
    value: 70,
    duration: 1.5,
    ease: "linear",
    onUpdate: function () {
      if (this.progress() >= 0.3) pushRequested.value = true;
    },
    onComplete: () => {
      isPageTransition.value = false;
      pushRequested.value = false;
    },
  });
});

watch(pushRequested, (status) => {
  if (status) router.push(path.value);
});

onMounted(() => {
  init();
});

onUnmounted(() => {});
</script>

<template>
  <div class="page-transition">
    <canvas id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<style scoped>
.page-transition {
  position: fixed;
  inset: 0;
  z-index: 3000;
  pointer-events: none;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
