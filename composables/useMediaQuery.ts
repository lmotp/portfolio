// composables/useMediaQuery.js
export default () => {
  const isMobile = ref(false);

  onMounted(() => {
    const media = window.matchMedia("(max-width: 767px)");
    isMobile.value = media.matches;

    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      return isMobile.value = e.matches;
    };
    media.addEventListener("change", update);

    onUnmounted(() => media.removeEventListener("change", update));
  });

  return isMobile;
};
