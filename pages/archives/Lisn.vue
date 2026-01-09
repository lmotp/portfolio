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
    <div ref="stickyWrap" class="sticky-wrap">
      <article class="inner-1">
        <div class="media-container">
          <figure class="media">
            <img :src="config.content[0].img" alt="" />
            <figcaption>{{ config.content[0].caption }}</figcaption>
            <small>(01)</small>
          </figure>
        </div>
      </article>

      <article class="inner-2">
        <div class="media-container">
          <figure class="media">
            <img :src="config.content[1].img" alt="" />
            <figcaption>{{ config.content[1].caption }}</figcaption>
            <small>(02)</small>
          </figure>
        </div>

        <div class="media-container">
          <figure class="media">
            <img :src="config.content[2].img" alt="" />
            <figcaption>{{ config.content[2].caption }}</figcaption>
            <small>(03)</small>
          </figure>
        </div>

        <div class="media-container">
          <figure class="media">
            <img :src="config.content[3].img" alt="" />
            <figcaption>{{ config.content[3].caption }}</figcaption>
            <small>(04)</small>
          </figure>
        </div>
      </article>

      <article class="inner-3">
        <div class="media-container">
          <figure class="media">
            <img :src="config.content[4].img" alt="" />
            <figcaption>{{ config.content[4].caption }}</figcaption>
            <small>(05)</small>
          </figure>
        </div>

        <div class="media-container">
          <figure class="media">
            <img :src="config.content[5].img" alt="" />
            <figcaption>{{ config.content[5].caption }}</figcaption>
            <small>(06)</small>
          </figure>
        </div>
      </article>
    </div>
  </Archives>
</template>

<style scoped>
.sticky-wrap {
  .inner-1 {
    display: flex;
    justify-content: center;

    .media-container {
      max-width: 800px;

      .media {
        aspect-ratio: 1 / 0.8596296296296297;
      }
    }
  }

  .inner-2 {
    display: flex;

    .media-container {
      .media {
        height: 40.7142857vw;
      }
      &:nth-child(1) {
        width: 32.0713235%;
      }
      &:nth-child(2) {
        width: 51.8926471%;
      }
      &:nth-child(3) {
        width: 15.9558824%;
      }
      &:not(:last-child) {
        margin-right: var(--margin);
      }
    }
  }

  .inner-3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .media-container:first-child {
      width: 20%;

      .media {
        aspect-ratio: 1 / 1;
      }
    }
    .media-container:nth-child(2) {
      width: 61.8033989%;
      margin-top: var(--margin);
      .media {
        aspect-ratio: 376 / 400;
      }
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
}
</style>
