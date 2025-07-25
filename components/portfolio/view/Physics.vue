<script setup lang="ts">
import Matter, { Events } from "matter-js";

const emit = defineEmits(["initPhysics"]);

const isSensorDetected = ref(false);

const sensorCount = ref(1);
const container = ref<HTMLElement | null>(null);
const barConfig = [
  { x: -100, y: -200, width: 700, height: 20, angle: 10.8 },
  { x: 125, y: 0, width: 700, height: 20, angle: -12 },
  { x: -100, y: 200, width: 700, height: 20, angle: 7.2 },
  { x: -(window.innerWidth / 2 / 2 + 50), y: 450, width: window.innerWidth / 2 - 50, height: 20, angle: 4 },
  { x: window.innerWidth / 2 / 2 + 50, y: 450, width: window.innerWidth / 2 - 50, height: 20, angle: -4 },
];
const pointConfig = [{ x: -300, y: 70 }];

let render: Matter.Render;
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Bounds = Matter.Bounds;
const Composite = Matter.Composite;

const engine = Engine.create();
const engineWorld = engine.world;

const createCross = ({ x, y, width, height, thickness, options }: crossType) => {
  // 가로 막대
  const horizontalBar = Bodies.rectangle(x, y, width, thickness, options);

  // 세로 막대
  const verticalBar = Bodies.rectangle(x, y, thickness, height, options);

  // 두 바디를 복합체로 묶음 (선택 사항이지만 관리하기 편리함)
  const cross = Composite.create({ label: "Cross" });
  Composite.add(cross, horizontalBar);
  Composite.add(cross, verticalBar);

  return cross;
};

const init = async () => {
  if (!container.value) return;
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

  //물체 생성
  const BALL_OFFSET = 20;
  const centerX = container.value!.clientWidth / 2;
  const centerY = container.value!.clientHeight / 2;
  const startCircleX = centerX + BALL_OFFSET + barConfig[0].x - barConfig[0].width / 2;
  const startCircleY = BALL_OFFSET;

  const circle = Bodies.circle(startCircleX, startCircleY, 10, {
    friction: 0.00001,
    restitution: 0.5,
    density: 0.001,
    isStatic: false,
    render: { fillStyle: "black", lineWidth: 0, strokeStyle: "transparent" },
  });
  const points = pointConfig.map((point) => {
    const body = Bodies.polygon(centerX + point.x, centerY + point.y, 5, 5, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "black", lineWidth: 0, strokeStyle: "transparent" },
    });
    return body;
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
  const cross = createCross({
    x: centerX - 300,
    y: centerY + 70,
    width: 50,
    height: 50,
    thickness: 10,
    options: { isStatic: true, render: { fillStyle: "black", lineWidth: 0, strokeStyle: "transparent" } },
  });

  World.add(engineWorld, [...bars, sensorBar, circle, ...points, cross]);

  //이벤트
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

    Composite.rotate(cross, useTransferDgreeToRadia(10), { x: centerX - 300, y: centerY + 70 });
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
