<script setup>
import { Engine, Render, World, Bodies, Runner, Common, Body } from "matter-js";
import seedImgSrc from "@/assets/images/seed.png";

const props = defineProps(["isLoading"]);

const canvasContainer = ref(null);
const render = ref(null);
const runner = ref(null);
const world = ref(null);
const engine = ref(null);
const seedCount = ref(0);
const floor = ref([]);

let interval;
let updateInterval;

const MAX_SEED_COUNT = 250;

watch(
  toRef(() => props.isLoading),
  () => {
    World.remove(world.value, floor.value);
  }
);

onMounted(() => {
  const seeds = [];
  const width = window.innerWidth;
  const height = window.innerHeight;

  engine.value = Engine.create();
  world.value = engine.value.world;

  render.value = Render.create({
    element: canvasContainer.value,
    engine: engine.value,
    options: { width, height, wireframes: false, background: "transparent" },
  });

  // 벽
  const _floor = createFloor(width / 2, height, width, 32);
  const _floorLeft = createFloor(0, height / 2, 50, height);
  const _floorRight = createFloor(width, height / 2, 50, height);

  floor.value = [_floor, _floorLeft, _floorRight];

  World.add(world.value, floor.value);

  // 씨앗 생성
  interval = setInterval(() => createSeed(seeds, width), 1000);
  updateInterval = setInterval(() => updateSeedAngles(seeds), 16); // 약 60fps

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

const createFloor = (x, y, width, height) => {
  const _floor = Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });

  return _floor;
};

const createSeed = (seeds, width) => {
  if (seedCount.value > MAX_SEED_COUNT) {
    clearInterval(interval);
    clearInterval(updateInterval);
    return;
  }

  const x = Common.random(0, width);
  const y = Common.random(-50, 0);

  const seed = Bodies.rectangle(x, y, 20, 38, {
    restitution: 0.35,
    friction: 0.005,
    frictionAir: 0.065,
    render: { sprite: { texture: seedImgSrc, xScale: 0.5, yScale: 0.5 } },
  });

  seed.angle = 0; // 각도 초기화
  seed.angleSpeed = Common.random(0.025, 0.06); // 각도 변화 속도
  seed.maxAngle = useTransferDgreeToRadia(2.5); // 15도 (라디안)

  World.add(world.value, seed);
  seeds.push(seed);
  seedCount.value++;
};

const updateSeedAngles = (seeds) => {
  seeds.forEach((seed) => {
    seed.angle += seed.angleSpeed;

    if (Math.abs(seed.angle) > seed.maxAngle) {
      seed.angleSpeed = -seed.angleSpeed; // 방향 전환
    }

    Body.setAngle(seed, seed.angle);
  });
};
</script>

<template>
  <div class="matter-wrap">
    <div ref="canvasContainer" />
  </div>
</template>

<style scoped>
.matter-wrap {
  position: absolute;
  inset: 0;
  z-index: var(--matter-zIndex);
  pointer-events: none;
  user-select: none;

  div {
    width: 100%;
    height: 100%;
  }
}
</style>
