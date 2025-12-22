<script setup lang="ts">
const config = {
  id: 0,
  title: "NeweastArt",
  desc: `Nuxt 3 프레임워크를 사용해 전체 UI를 구현
퍼블리싱부터 백엔드 데이터 연결하여 동적인 웹 서비스 제작
`,
  date: `2023.01.01 ~ 2023.02.01`,
  stack: ["Nuxt", "SCSS"],
  mainImg: {
    src: "https://player.vimeo.com/progressive_redirect/playback/1007627724/rendition/1080p/file.mp4?loc=external&log_user=0&signature=41fcd2bd8b9c45ffb168fd843955caf3daa868b55bceb67f951cce974f296f6c",
    type: "video",
  },
};
</script>

<template>
  <Works :config="config" />
</template>

<style scoped></style>
