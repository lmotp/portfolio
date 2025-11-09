<script setup lang="ts">
import * as rive from "@rive-app/canvas";
import gsap from "gsap";

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
      transitionInput.value = 10;
      r.resizeDrawingSurfaceToCanvas();
      r.play();

      gsap.to(transitionInput, {
        value: 100,
        duration: 3,
        ease: "linear",
        onUpdate: () => {
          console.log(transitionInput.value);
        },
      });
    },
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <canvas id="canvas" width="500" height="500"></canvas>
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
