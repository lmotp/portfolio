<script setup lang="ts">
import { archivesData } from "~/utils/data";

const index = computed(() => archivesData.findIndex((v) => v.title === "Lisn"));
const config = computed(() => archivesData[index.value]);
const nextConfig = computed(() => {
  const nextIndex = archivesData.length - 1 === index.value ? 0 : index.value + 1;
  const { src, title } = archivesData[nextIndex];

  return { nextTitle: title, nextSrc: src };
});
</script>

<template>
  <Archives :config="config" :nextConfig="nextConfig">
    <template #info-0>
      <div class="sticky-wrap wrap-1">
        <article class="inner-1">
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[0].img)" alt="" />
              <figcaption>{{ config.data[0].content[0].caption }}</figcaption>
              <small>(01)</small>
            </figure>
          </div>
        </article>

        <article class="inner-2">
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[1].img)" alt="" />
              <figcaption>{{ config.data[0].content[1].caption }}</figcaption>
              <small>(02)</small>
            </figure>
          </div>

          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[2].img)" alt="" />
              <figcaption>{{ config.data[0].content[2].caption }}</figcaption>
              <small>(03)</small>
            </figure>
          </div>

          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[3].img)" alt="" />
              <figcaption>{{ config.data[0].content[3].caption }}</figcaption>
              <small>(04)</small>
            </figure>
          </div>
        </article>

        <article class="inner-3">
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[4].img)" alt="" />
              <figcaption>{{ config.data[0].content[4].caption }}</figcaption>
              <small>(05)</small>
            </figure>
          </div>

          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[5].img)" alt="" />
              <figcaption>{{ config.data[0].content[5].caption }}</figcaption>
              <small>(06)</small>
            </figure>
          </div>

          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[6].img)" alt="" />
              <figcaption>{{ config.data[0].content[6].caption }}</figcaption>
              <small>(07)</small>
            </figure>
          </div>
        </article>
      </div>
    </template>
    <template #info-1>
      <div class="sticky-wrap wrap-2">
        <article class="inner-1">
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[1].content[0].img)" alt="" />
              <figcaption>{{ config.data[1].content[0].caption }}</figcaption>
              <small>(01)</small>
            </figure>
          </div>
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[1].content[1].img)" alt="" />
              <figcaption>{{ config.data[1].content[1].caption }}</figcaption>
              <small>(02)</small>
            </figure>
          </div>
        </article>
      </div>
    </template>
  </Archives>
</template>

<style scoped>
.sticky-wrap {
  &.wrap-1 {
    .inner-1 {
      display: flex;
      justify-content: center;

      .media-container {
        max-width: 800px;
      }
    }

    .inner-2,
    .inner-3 {
      display: flex;
      justify-content: space-evenly;
      gap: 10px;

      .media-container {
        width: min(50%, 600px);
      }
    }
  }

  &.wrap-2 {
    .inner-1 {
      display: flex;
      justify-content: space-evenly;
      gap: 10px;

      .media-container {
        max-width: 400px;
      }
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  hr {
    margin-block: 125px;
  }
}
</style>
