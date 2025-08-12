import { defineStore } from "pinia";

export const useSpeedStore = defineStore("speed", {
  state: () => ({
    currentSpeed: 0,
    isEnabled: false,
  }),
  actions: {
    updateSpeed(speed) {
      this.currentSpeed = speed;
    },
    updateEnabled(enabled) {
      this.isEnabled = enabled;
    },
  },
});
