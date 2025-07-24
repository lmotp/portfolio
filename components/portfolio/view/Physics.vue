<script setup lang="ts">
import Matter, { Events } from "matter-js";

const emit = defineEmits(["initPhysics"]);

const isSensorDetected = ref(false);

const sensorCount = ref(1);
const container = ref<HTMLElement | null>(null);
const barConfig = [
  { x: -100, y: -200, width: 700, height: 20, angle: 10.8 },
  { x: 150, y: 0, width: 700, height: 20, angle: -10.8 },
  { x: -100, y: 200, width: 700, height: 20, angle: 7.2 },
  { x: -(window.innerWidth / 2 / 2 + 50), y: 450, width: window.innerWidth / 2 - 50, height: 20, angle: 4 },
  { x: window.innerWidth / 2 / 2 + 50, y: 450, width: window.innerWidth / 2 - 50, height: 20, angle: -4 },
];
let render: Matter.Render;

const init = async () => {
  if (!container.value) return;

  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Common = Matter.Common;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Bounds = Matter.Bounds;

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
      background: "#008080",
      hasBounds: true,
    },
  });

  // run the renderer
  Render.run(render);

  // create runner
  const runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  const BALL_OFFSET = 20;
  const centerX = container.value!.clientWidth / 2;
  const centerY = container.value!.clientHeight / 2;
  const startCircleX = centerX + BALL_OFFSET + barConfig[0].x - barConfig[0].width / 2;
  const startCircleY = BALL_OFFSET;

  const circle = Bodies.circle(startCircleX, startCircleY, Common.random(10, 20), {
    friction: 0.00001,
    restitution: 0.5,
    density: 0.001,
    isSleeping: false,
  });
  const bars = barConfig.map((bar) => {
    const body = Bodies.rectangle(centerX + bar.x, centerY + bar.y, bar.width, bar.height, {
      isStatic: true,
      angle: useTransferDgreeToRadia(bar.angle),
      render: { fillStyle: "black", lineWidth: 0, strokeStyle: "transparent" },
    });

    return body;
  });
  const sensorBar = Bodies.rectangle(centerX, centerY, window.innerWidth, 1, {
    isSensor: true,
    isStatic: true,
    render: { fillStyle: "transparent", lineWidth: 0, strokeStyle: "transparent" },
  });

  World.add(engineWorld, [...bars, sensorBar, circle]);

  Events.on(render, "beforeRender", () => {
    const targetY = 300;
    const currentY = render.bounds.min.y;
    const lerpAmount = 0.05;

    if (isSensorDetected.value) {
      const tolerance = 0.1; // 오차 허용 범위 (조절 가능)
      const isMove = Math.abs(currentY - targetY) > tolerance;

      if (isMove) {
        const newYPosition = useLerp(currentY, targetY, lerpAmount);
        const moveAmount = newYPosition - currentY;

        Bounds.translate(render.bounds, { x: 0, y: moveAmount });
      }
    }
  });

  Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;

    pairs.forEach((pair) => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      // 센서가 true인 rectangle 감지
      if (bodyB.isSensor && bodyA === circle) {
        Body.setPosition(sensorBar, { x: centerX, y: centerY + 70 * sensorCount.value });
        sensorCount.value++;
        isSensorDetected.value = true;
      }
    });
  });

  render.canvas.style.visibility = "hidden";

  emit("initPhysics", { Events: Matter.Events, canvas: render.canvas, engine });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div ref="container" class="container"></div>
</template>

<style scoped></style>
