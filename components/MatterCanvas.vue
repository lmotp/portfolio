<template>
  <div ref="canvasContainer"></div>
</template>

<script setup>
import { Engine, Render, World, Bodies, Runner, Common } from "matter-js";
import seedImgSrc from "@/assets/images/seed.png";

const canvasContainer = ref(null);

const render = ref(null);
const runner = ref(null);
const world = ref(null);
const engine = ref(null);

onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  engine.value = Engine.create();
  world.value = engine.value.world;

  render.value = Render.create({
    element: canvasContainer.value,
    engine: engine.value,
    options: { width, height, wireframes: false, background: "transparent" },
  });

  const floor = Bodies.rectangle(width / 2, height, width, 15, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });

  World.add(world.value, floor);

  const createSeed = () => {
    const x = Common.random(0, 800);
    const y = Common.random(-600, 0);
    const size = Common.random(40, 80);

    const seed = Bodies.rectangle(x, y, size, size, {
      restitution: 0.8,
      friction: 0.005,
      render: { sprite: { texture: seedImgSrc, xScale: size / 128, yScale: size / 128 } },
    });

    World.add(world.value, seed);
  };

  setInterval(createSeed, 1000);

  Render.run(render.value);

  runner.value = Runner.create();
  Runner.run(runner.value, engine.value);
});

onUnmounted(() => {
  Render.stop(render.value);
  Runner.stop(runner.value);
  World.clear(world.value, false);
  Engine.clear(engine.value);
});
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
