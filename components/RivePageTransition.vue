<script setup lang="ts">
import * as rive from "@rive-app/canvas";

const init = () => {
  const r = new rive.Rive({
    src: "/rive/navigate_ui_transition_desktop_scroll.riv",
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "Transition Desktop",
    layout: new rive.Layout({
      fit: rive.Fit.Cover,
      alignment: rive.Alignment.Center,
    }),
    onLoad: () => {
      r.resizeDrawingSurfaceToCanvas();
      const inputs = r.stateMachineInputs("Transition Desktop");
      r.play();
      setInterval(() => {
        inputs[0].value += 1;
      }, 25);
    },
  });
};

onMounted(() => {
  init();
});
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
  z-index: 100;
  pointer-events: none;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
