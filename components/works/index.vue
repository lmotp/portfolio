<script setup lang="ts">
type configType = {
  id: number;
  title: string;
  desc: string;
  date: string;
  contribution: number;
  stack: string[];
};

const { config } = defineProps<{ config: configType }>();
const { id, title, desc, date, contribution, stack } = config;
</script>

<template>
  <article :id="`work-${id}`">
    <h2>{{ title }}</h2>
    <p>{{ desc }}</p>
    <time :datetime="date">{{ date }}</time>

    <div class="contribution">
      <span>기여도:</span>
      <strong>{{ contribution }}%</strong>
    </div>

    <ul>
      <li v-for="(value, id) of stack" :key="`stack-${id}`">
        {{ value }}
      </li>
    </ul>
  </article>
</template>

<style scoped></style>
