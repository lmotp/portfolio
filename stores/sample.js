import { ref } from "vue";

export const useSampleStore = defineStore("sample", () => {
  const sample = ref("");

  return { sample };
});
