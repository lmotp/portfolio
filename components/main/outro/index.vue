<script setup lang="ts">
import OutroTopView from "./OutroTopView.vue";
import OutroIntro from "./OutroIntro.vue";
import OutroLayerCard from "./OutroLayerCard.vue";
import { workData } from "~/utils/data";
</script>

<template>
  <div class="outro">
    <div class="top-view-container">
      <OutroTopView />
    </div>

    <OutroIntro />

    <div class="layer-card-container">
      <div class="layer-card-scroller">
        <div class="layer-card-sticky">
          <OutroLayerCard
            v-for="(card, index) in workData"
            v-bind="card"
            :isLast="index === workData.length - 1"
            :key="index"
          />
        </div>
      </div>

      <div class="layer-card-trigger-wrap" :aria-hidden="true">
        <div
          v-for="(_, index) in workData.length + 1"
          :key="index"
          :class="['layer-card-trigger', `index-${index}`]"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outro {
  position: relative;
  width: 100%;
  padding-top: calc(100dvh * 2);
  background-color: var(--gray);

  .top-view-container {
    position: relative;
    width: 100%;
    height: 300svh;
  }

  .layer-card-container {
    position: relative;
    overflow: visible;

    .layer-card-scroller {
      position: absolute;
      inset: 0;

      .layer-card-sticky {
        position: sticky;
        top: 0;
        height: 100lvh;
      }
    }

    .layer-card-trigger-wrap {
      .layer-card-trigger {
        position: relative;
        height: 100lvh;
        width: 48px;
        opacity: 0;
        z-index: 2;
      }
    }
  }
}
</style>
