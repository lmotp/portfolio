<script setup lang="ts">
import OutroTopView from "./OutroTopView.vue";
import OutroLayerCard from "./OutroLayerCard.vue";

const layerCards = ref([
  {
    id: 1,
    url: "/portfolio",
    title: "TEST-1",
    type: "video",
    src: "https://player.vimeo.com/progressive_redirect/playback/1075238854/rendition/1440p/file.mp4?loc=external&log_user=0&signature=ab2898724061630d120ac55f4d347abc72e77432b75945a58a7436f1975b7a18",
  },
  {
    id: 2,
    url: "/portfolio",
    title: "TEST-2",
    type: "image",
    src: "https://www.datocms-assets.com/136821/1724083284-highresstills_thelineanimation_azukielementals_09.jpeg?fit=crop&h=1928&w=3424",
  },
  {
    id: 3,
    url: "/portfolio",
    title: "TEST-3",
    type: "video",
    src: "https://player.vimeo.com/progressive_redirect/playback/1007627724/rendition/1080p/file.mp4?loc=external&log_user=0&signature=41fcd2bd8b9c45ffb168fd843955caf3daa868b55bceb67f951cce974f296f6c",
  },
]);
</script>

<template>
  <div class="outro">
    <div class="top-view-container">
      <OutroTopView />
    </div>

    <div class="layer-card-container">
      <div class="layer-card-scroller">
        <div class="layer-card-sticky">
          <OutroLayerCard
            v-for="(card, index) in layerCards"
            v-bind="card"
            :isLast="index === layerCards.length - 1"
            :key="index"
          />
        </div>
      </div>

      <div :aria-hidden="true">
        <div v-for="(_, index) in layerCards" :key="index" :class="['layer-card-trigger', `index-${index}`]"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outro {
  position: relative;
  padding-top: calc(100dvh * 4 - 30px);
  z-index: -1;

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
  }

  .layer-card-trigger {
    position: relative;
    height: 100lvh;
    width: 3rem;
    opacity: 0;
    z-index: 2;
  }
}
</style>
