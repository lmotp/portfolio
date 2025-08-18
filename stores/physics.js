import { defineStore } from "pinia";

export const usePhysicsStore = defineStore("physics", {
  state: () => ({
    isDownBtnShow: false,
    isSuccess: false,
    isPress: false,
    isShowThree: false,
    PRESS_TIME: 1600,
  }),
  actions: {},
});
