<script setup lang="ts">
import Matter, { Events } from "matter-js";
import * as polyDecomp from "poly-decomp";
import { useSpeedStore } from "@/stores/speed";
import { usePhysicsStore } from "@/stores/physics";
import { storeToRefs } from "pinia";

// Initialize poly-decomp
Matter.Common.setDecomp(polyDecomp);
const emit = defineEmits(["initPhysics"]);

const TOTAL_SENSOR = 6;
const isSensorDetected = ref(false);
const sensorCount = ref(1);
const selectedBody = ref<Matter.Body | null>(null);
const offset = ref<{ x: number; y: number }>({ x: 0, y: 0 });

const container = ref<HTMLElement | null>(null);
const targetY = ref(300);
const cardConfig = [
  { x: 200, y: 58, w: 320, h: 200, angle: -7.2 },
  { x: 90, y: 265, w: 400, h: 200, angle: 8.2 },
  { x: -215, y: 430, w: 300, h: 150, angle: 13.2 },
  { x: 273, y: 650, w: 500, h: 200, angle: -13.2 },
  { x: -273, y: 850, w: 600, h: 300, angle: -15.2 },
];

const textConfig = [
  { x: 210, y: 58 },
  { x: -110, y: 58 },
  { x: 10, y: 58 },
  { x: -10, y: 58 },
];

const barConfig = [
  { x: -100, y: -200, width: 700, height: 20, angle: 10.8 },
  { x: 125, y: 0, width: 700, height: 20, angle: -12 },
  { x: -100, y: 200, width: 700, height: 20, angle: 7.2 },
  { x: -(window.innerWidth / 2 / 2 + 50), y: 450, width: window.innerWidth / 2 - 50, height: 20, angle: 4 },
  { x: window.innerWidth / 2 / 2 + 50, y: 450, width: window.innerWidth / 2 - 50, height: 20, angle: -4 },
];

const pointConfig = [{ x: -300, y: 70 }];
const speedStore = useSpeedStore();
const physicsStore = usePhysicsStore();
const { isDownBtnShow, isSuccess, isShowThree } = storeToRefs(physicsStore);

let render: Matter.Render;
let cards: Matter.Body[] = [];
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Bounds = Matter.Bounds;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const engine = Engine.create();
const engineWorld = engine.world;

const createCross = ({ x, y, width, height, thickness, options }: crossType) => {
  const horizontalBar = Bodies.rectangle(x, y, width, thickness, options);
  const verticalBar = Bodies.rectangle(x, y, thickness, height, options);
  const cross = Composite.create({ label: "Cross" });
  Composite.add(cross, horizontalBar);
  Composite.add(cross, verticalBar);
  return cross;
};

const loadImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const init = async () => {
  if (!container.value) return;

  render = Render.create({
    element: container.value,
    engine: engine,
    options: {
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      wireframes: false,
      background: "transparent",
      hasBounds: true,
    },
  });

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      render: {
        visible: false, // 마우스 제약 조건을 숨깁니다
      },
    },
  });

  Composite.add(engineWorld, mouseConstraint);
  render.mouse = mouse;

  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  const BALL_OFFSET = 20;
  const centerX = container.value!.clientWidth / 2;
  const centerY = container.value!.clientHeight / 2;
  const startCircleX = centerX + BALL_OFFSET + barConfig[0].x - barConfig[0].width / 2;
  const startCircleY = BALL_OFFSET;

  const circle = Bodies.circle(startCircleX, startCircleY, 10, {
    friction: 0.0000001,
    restitution: 0.6,
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
  const cross = createCross({
    x: centerX - 300,
    y: centerY + 70,
    width: 50,
    height: 50,
    thickness: 10,
    options: { isStatic: true, render: { fillStyle: "black", lineWidth: 0, strokeStyle: "transparent" } },
  });

  const bars = barConfig.map((bar) => {
    const body = Bodies.rectangle(centerX + bar.x, centerY + bar.y, bar.width, bar.height, {
      isStatic: true,
      angle: useTransferDgreeToRadia(bar.angle),
      render: { fillStyle: "black", lineWidth: 0, strokeStyle: "transparent" },
    });
    return body;
  });

  const sensorBars = new Array(TOTAL_SENSOR).fill(0).map((_, index) => {
    const body = Bodies.rectangle(centerX, centerY + 300 * index, window.innerWidth, 1, {
      isSensor: true,
      isStatic: true,
      label: `sensor-${index + 1}`,
      render: { fillStyle: "transparent", lineWidth: 0, strokeStyle: "transparent" },
    });
    return body;
  });

  cards = await Promise.all(
    cardConfig.map(async (card, index) => {
      const y = 1000 + card.y;
      const imageUrl = `/images/card/image-${index + 1}.jpg`;
      const img = await loadImage(imageUrl);
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const xScale = card.w / originalWidth;
      const yScale = card.h / originalHeight;

      const body = Bodies.rectangle(centerX + card.x, y, card.w, card.h, {
        isStatic: true,
        angle: useTransferDgreeToRadia(card.angle),
        render: {
          sprite: { texture: imageUrl, xScale: xScale, yScale: yScale },
        },
        label: "card-body",
      });
      return body;
    })
  );

  const textCards = await Promise.all(
    textConfig.map(async (text) => {
      const y = sensorBars.at(-1)!.position.y + 550;
      const imageUrl = `/images/physics/test_text.png`;
      const img = await loadImage(imageUrl);
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      const body = Bodies.rectangle(centerX + text.x, y, originalWidth, originalHeight, {
        render: {
          sprite: { texture: imageUrl, xScale: 1, yScale: 1 },
        },
        density: 0.001,
        restitution: 0.5,
        friction: 0.01,
        label: "textCard",
      });
      return body;
    })
  );

  const numSegments = 300;
  const segmentWidth = window.innerWidth / numSegments;
  const waveHeight = 450;
  const waveY = sensorBars.at(-1)!.position.y + 550;
  let wavePhase = 0;

  const waveBodies = Composites.stack(0, waveY, numSegments, 1, 0, 0, (x: number, y: number) => {
    return Bodies.rectangle(x, y + waveHeight / 2, segmentWidth, waveHeight, {
      isStatic: true,
      render: { fillStyle: "#00f" },
      label: "wave",
    });
  }).bodies;

  Composite.add(engineWorld, waveBodies);

  const wallThickness = 50;
  const wallHeight = waveBodies.at(-1)!.position.y + waveHeight;
  const wallY = container.value!.clientHeight / 2;
  const leftWall = Bodies.rectangle(0, wallY, wallThickness, wallHeight, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });

  const rightWall = Bodies.rectangle(container.value!.clientWidth, wallY, wallThickness, wallHeight, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });

  World.add(engineWorld, [
    ...bars,
    ...points,
    ...sensorBars,
    ...cards,
    circle,
    cross,
    leftWall,
    rightWall,
    ...textCards,
  ]);

  Events.on(render, "beforeRender", () => {
    const currentY = render.bounds.min.y;
    const lerpAmount = 0.05;
    const velocity = circle.velocity;
    const vx = velocity.x;
    const vy = velocity.y;
    const speed = Math.sqrt(vx * vx + vy * vy);

    speedStore.updateSpeed(Math.min(speed, 5));

    if (isSensorDetected.value) {
      const tolerance = 0.1;
      const isMove = Math.abs(currentY - targetY.value) > tolerance;

      if (isMove) {
        const newYPosition = useLerp(currentY, targetY.value, lerpAmount);
        const moveAmount = newYPosition - currentY;
        Bounds.translate(render.bounds, { x: 0, y: moveAmount });
      }
    }

    if (isSuccess.value && isDownBtnShow.value) {
      const targetYPosition = waveBodies[0].position.y - waveHeight / 2;
      targetY.value = targetYPosition + 25;
      Body.setPosition(circle, { x: circle.position.x, y: targetYPosition + 50 });

      isDownBtnShow.value = false;
    }

    Composite.rotate(cross, useTransferDgreeToRadia(15), { x: centerX - 300, y: centerY + 70 });

    const waveAmplitude = 30;
    const waveFrequency = 0.005;
    const waveSpeed = 0.05;

    wavePhase += waveSpeed;
    waveBodies.forEach((body) => {
      const yOffset = waveAmplitude * Math.sin(body.position.x * waveFrequency + wavePhase);
      Body.setPosition(body, { x: body.position.x, y: waveY + yOffset + waveHeight / 2 });
    });
  });

  Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (bodyA === circle && (bodyB.label === "wave" || bodyB.label === "textCard")) {
        speedStore.updateEnabled(true);
        isDownBtnShow.value = true;
      }

      if (bodyB.isSensor && bodyA === circle && bodyB.label.includes("sensor")) {
        const currentSensorCount = Number(bodyB.label.split("-")[1]);
        let offsetY = 300;

        if (currentSensorCount === TOTAL_SENSOR) {
          isShowThree.value = true;
          offsetY = 350;
        }

        targetY.value = currentSensorCount * offsetY;
        sensorCount.value = currentSensorCount;
        isSensorDetected.value = true;
      }
    });
  });

  Events.on(mouseConstraint, "mousedown", (event) => {
    const body = event.source.body;
    const mousePosition = event.mouse.position;

    if (body?.label === "card-body") {
      selectedBody.value = body;
      offset.value = { x: body.position.x - mousePosition.x, y: body.position.y - mousePosition.y };
    }
  });

  Events.on(mouseConstraint, "mousemove", (event) => {
    if (selectedBody.value) {
      const mousePosition = event.mouse.position;
      Body.setPosition(selectedBody.value, {
        x: mousePosition.x + offset.value.x,
        y: mousePosition.y + offset.value.y,
      });
    }
  });

  Events.on(mouseConstraint, "mouseup", () => {
    selectedBody.value = null;
    offset.value = { x: 0, y: 0 };
  });

  emit("initPhysics", { Events: Matter.Events, canvas: render.canvas, engine });
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  World.clear(engineWorld, false);
  Engine.clear(engine);
  Render.stop(render);
});
</script>

<template>
  <div ref="container" class="container" />
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
