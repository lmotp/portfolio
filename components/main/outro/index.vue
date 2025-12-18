<script setup lang="ts">
import OutroTopView from "./OutroTopView.vue";
import OutroIntro from "./OutroIntro.vue";
import OutroLayerCard from "./OutroLayerCard.vue";
import OutroModal from "./OutroModal.vue";

const layerCards = [
  {
    id: 1,
    url: "/",
    title: "TEST-1",
    type: "video",
    src: "https://player.vimeo.com/progressive_redirect/playback/1075238854/rendition/1440p/file.mp4?loc=external&log_user=0&signature=ab2898724061630d120ac55f4d347abc72e77432b75945a58a7436f1975b7a18",
  },
  {
    id: 2,
    url: "/",
    title: "TEST-2",
    type: "image",
    src: "https://www.datocms-assets.com/136821/1724083284-highresstills_thelineanimation_azukielementals_09.jpeg?fit=crop&h=1928&w=3424",
  },
  {
    id: 3,
    url: "/",
    title: "TEST-3",
    type: "video",
    src: "https://player.vimeo.com/progressive_redirect/playback/1007627724/rendition/1080p/file.mp4?loc=external&log_user=0&signature=41fcd2bd8b9c45ffb168fd843955caf3daa868b55bceb67f951cce974f296f6c",
  },
];

const activeIndex = ref<number>(0);
const isToggle = ref(false);
const modalConfig = computed(() => layerCards[activeIndex.value]);

const handleOpenModal = (id: number) => {
  activeIndex.value = id;
  isToggle.value = true;
};
const handleCloseModal = () => {
  isToggle.value = false;
};
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
            v-for="(card, index) in layerCards"
            v-bind="card"
            :isLast="index === layerCards.length - 1"
            :key="index"
            @onClickCard="handleOpenModal"
          />
        </div>
      </div>

      <div class="layer-card-trigger-wrap" :aria-hidden="true">
        <div
          v-for="(_, index) in layerCards.length + 1"
          :key="index"
          :class="['layer-card-trigger', `index-${index}`]"
        ></div>
      </div>
    </div>
  </div>

  <OutroModal v-if="isToggle" :config="modalConfig" @onClickClsoeModal="handleCloseModal" />
</template>

<style scoped>
.outro {
  position: relative;
  width: 100%;
  padding-top: calc(100dvh * 2);
  background-color: #dddee2;

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
