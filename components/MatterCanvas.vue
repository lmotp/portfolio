<template>
  <div ref="canvasContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Engine, Render, World, Bodies, Runner } from "matter-js";

const canvasContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (process.client) {
    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: canvasContainer.value!,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "#f0f0f0",
      },
    });

    const ground = Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
    World.add(world, ground);

    const createCircle = () => {
      const circle = Bodies.circle(Math.random() * 800, 50, 20, { restitution: 0.5, friction: 0.1 });
      World.add(world, circle);
    };

    setInterval(createCircle, 1000);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    onUnmounted(() => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
    });
  }
});
</script>

<style scoped>
div {
  width: 800px;
  height: 600px;
  margin: 0 auto;
}
</style>
