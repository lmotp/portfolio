<template>
  <div ref="canvasContainer"></div>
</template>

<script setup>
import { Engine, Render, World, Bodies, Runner, Common, Body } from "matter-js";
import seedImgSrc from "@/assets/images/seed.png";

const canvasContainer = ref(null);

const render = ref(null);
const runner = ref(null);
const world = ref(null);
const engine = ref(null);
const seedCount = ref(0);

onMounted(() => {
  const seeds = [];
  const width = window.innerWidth;
  const height = window.innerHeight;
  let interval;
  let updateInterval;

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

  const floorLeft = Bodies.rectangle(0, height / 2, 50, height, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });

  const floorRight = Bodies.rectangle(width, height / 2, 50, height, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });

  World.add(world.value, [floor, floorLeft, floorRight]);

  const createSeed = () => {
    if (seedCount.value > 30) {
      clearInterval(interval);
      return;
    }

    const x = Common.random(0, width);
    const y = Common.random(-50, 0);

    const seed = Bodies.rectangle(x, y, 20, 38, {
      restitution: 0.35,
      friction: 0.005,
      frictionAir: 0.05,
      render: { sprite: { texture: seedImgSrc, xScale: 0.5, yScale: 0.5 } },
    });

    seed.angle = 0; // 각도 초기화
    seed.angleSpeed = Common.random(0.02, 0.05); // 각도 변화 속도
    seed.maxAngle = Math.PI / 12; // 15도 (라디안)

    World.add(world.value, seed);
    seeds.push(seed);
    seedCount.value++;
  };
  const updateSeedAngles = () => {
    seeds.forEach((seed) => {
      seed.angle += seed.angleSpeed;
      if (Math.abs(seed.angle) > seed.maxAngle) {
        seed.angleSpeed = -seed.angleSpeed; // 방향 전환
      }
      Body.setAngle(seed, seed.angle);
    });
  };

  interval = setInterval(createSeed, 1000);
  updateInterval = setInterval(updateSeedAngles, 16); // 약 60fps

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
