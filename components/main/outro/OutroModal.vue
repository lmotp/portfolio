<script setup lang="ts">
const { config } = defineProps({ config: Object });
const emits = defineEmits(["onClickClsoeModal"]);
</script>

<template>
  <Transition>
    <Teleport to="#teleports">
      <div class="my-modal" role="dialog" :aria-modal="true" aria-labelledby="modal">
        <div class="inner">
          <h2>{{ config!.title }}</h2>
          <p>Teleport와 Dialog의 조합입니다.</p>
          <button @click="$emit('onClickClsoeModal')">닫기</button>
        </div>
      </div>
    </Teleport>
  </Transition>
</template>

<style scoped>
.my-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  backdrop-filter: blur(6px);
  background-color: rgba(20, 20, 20, 0.45);

  .inner {
    position: absolute;
    inset: 50% 10% 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 1440px;
    min-width: 320px;
    aspect-ratio: 1 / 0.65;
    background-color: white;
    transform: translateY(-50%);
  }
}
</style>
