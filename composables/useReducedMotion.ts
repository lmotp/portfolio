export default () => {
  const prefersReducedMotion = ref(false);
  if (import.meta.client) {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.value = media.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion.value = event.matches;
    };

    media.addEventListener("change", handleChange);

    onUnmounted(() => media.removeEventListener("change", handleChange));
  }

  return prefersReducedMotion;
};
