<script setup lang="ts">
import { archivesData } from "~/utils/data";

const index = computed(() => archivesData.findIndex((v) => v.title === "Meum"));
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
        </article>

        <article class="inner-3">
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[0].content[3].img)" alt="" />
              <figcaption>{{ config.data[0].content[3].caption }}</figcaption>
              <small>(04)</small>
            </figure>
          </div>
        </article>

        <article class="inner-4">
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
        </article>
      </div>
    </template>

    <template #info-2>
      <div class="sticky-wrap wrap-2">
        <article class="inner-1">
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[2].content[0].img)" alt="" />
              <figcaption>{{ config.data[2].content[0].caption }}</figcaption>
              <small>(01)</small>
            </figure>
          </div>
        </article>

        <article class="inner-2">
          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[2].content[1].img)" alt="" />
              <figcaption>{{ config.data[2].content[1].caption }}</figcaption>
              <small>(02)</small>
            </figure>
          </div>

          <div class="media-container">
            <figure class="media">
              <img :src="usePublicAsset(config.data[2].content[2].img)" alt="" />
              <figcaption>{{ config.data[2].content[2].caption }}</figcaption>
              <small>(03)</small>
            </figure>
          </div>
        </article>
      </div>
    </template>
  </Archives>
</template>

<style scoped>
.sticky-wrap {
  .inner-1,
  .inner-3 {
    display: flex;
    justify-content: center;

    .media-container {
      max-width: 800px;
    }
  }

  .inner-2,
  .inner-4 {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;

    .media-container {
      width: min(calc(50% - 15px), 600px);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
}

@media screen and (max-width: 768px) {
  .sticky-wrap {
    .inner-2,
    .inner-4 {
      gap: 20px;

      .media-container {
        width: calc(50% - 10px);
        min-width: 250px;
      }
    }
  }
}

@media screen and (max-width: 574px) {
  .sticky-wrap {
    .inner-2,
    .inner-4 {
      .media-container {
        width: 100%;
      }
    }
  }
}
</style>
