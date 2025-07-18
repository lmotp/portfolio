<script setup lang="ts">
import Matter from "matter-js";

const count = ref(0);
const emit = defineEmits(["physicsCanvas"]);
const container = ref<HTMLElement | null>(null);
const barConfig = [
  { x: 200, y: 100, width: 700, height: 20, angle: 10.8 },
  { x: 500, y: 250, width: 700, height: 20, angle: -10.8 },
  { x: 340, y: 400, width: 700, height: 20, angle: 7.2 },
];
let render: Matter.Render;

const init = async () => {
  if (!container.value) return;

  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Composite = Matter.Composite;
  const Composites = Matter.Composites;
  const Common = Matter.Common;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Events = Matter.Events;

  // create an engine
  const engine = Engine.create();
  const engineWorld = engine.world;

  // create a renderer
  render = Render.create({
    element: container.value,
    engine: engine,
    options: {
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      wireframes: false,
      background: "transparent",
    },
  });

  // run the renderer
  Render.run(render);

  // create runner
  const runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  const stack = Composites.stack(20, 20, 20, 5, 0, 0, function (x: number, y: number) {
    return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
  });

  World.add(engineWorld, stack);

  const bars = barConfig.map((bar) => {
    const body = Bodies.rectangle(bar.x, bar.y, bar.width, bar.height, {
      isStatic: true,
      angle: useTransferDgreeToRadia(bar.angle),
    });
    return body;
  });

  World.add(engineWorld, bars);

  // fit the render viewport to the scene
  Render.lookAt(render, Composite.allBodies(engineWorld));

  // wrapping using matter-wrap plugin
  for (let i = 0; i < stack.bodies.length; i++) {
    stack.bodies[i].plugin.wrap = {
      min: { x: render.bounds.min.x, y: render.bounds.min.y },
      max: { x: render.bounds.max.x, y: render.bounds.max.y },
    };
  }

  render.canvas.style.visibility = "hidden";

  Events.on(engine, "afterUpdate", () => {
    count.value++;
    emit("physicsCanvas", { canvas: render.canvas, count: count.value });
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div ref="container" class="container"></div>
</template>

<style scoped></style>
