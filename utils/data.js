export const archivesData = [
  {
    id: 1,
    title: "Monimo",
    desc: `Nuxt 3 기반 프레임워크 전환 및 핵심 메인(자산/혜택 등) 퍼블리싱
    디자인 시스템 구축 및 Storybook 기반 협업 프로세스 도입
    데이터 시각화를 위한 고난도 차트 UI 구현 및 QA 대응`,
    date: `1차 / 2023.07.10 ~ 2024.04.10\n2차 / 2024.10.13 ~ 2025.06.15`,
    stack: ["Nuxt", "Storybook", "SCSS", "Chart"],
    src: "/images/archives/3.png",
  },
  {
    id: 2,
    title: "Lisn",
    desc: `Nuxt 3 기반 프레임워크 전환 및 홈페이지 리뉴얼 퍼블리싱
    사내 프로젝트 Nuxt 3 + Express 개발`,
    date: `2024.04.10 ~ 2024.10.10`,
    stack: ["Nuxt", "SCSS", "Express"],
    src: "/images/archives/1.png",
  },
  {
    id: 3,
    title: "NeweastArt",
    desc: `Nuxt 3 프레임워크를 사용해 전체 UI를 구현
    데이터 시각화를 위한 고난도 차트 UI 구현 및 QA 대응`,
    date: `2023.01.01 ~ 2023.02.01`,
    stack: ["Nuxt", "SCSS"],
    src: "/images/archives/5.png",
  },
  {
    id: 4,
    title: "Meum",
    desc: `Nuxt 3 기반 프레임워크 전환 및 핵심 메인(자산/혜택 등) 퍼블리싱
    디자인 시스템 구축 및 Storybook 기반 협업 프로세스 도입
    데이터 시각화를 위한 고난도 차트 UI 구현 및 QA 대응`,
    date: `2022.04.10 ~ 2023.04.10`,
    stack: ["Nuxt", "SCSS"],
    src: "/images/archives/4.png",
  },
];
export const experimentsData = [
  [
    {
      title: "Pinball",
      content: "MatterJS / ThreeJS",
      src: "/images/skills/1.webp",
      pixelSrc: "/images/skills/1_pixel.png",
    },
    {
      title: "Card",
      content: "Mouse / Interaction",
      src: "/images/skills/2.webp",
      pixelSrc: "/images/skills/2_pixel.png",
    },
  ],
  [
    {
      title: "Burn",
      content: "WebGL / ThreeJS",
      src: "/images/skills/3.webp",
      pixelSrc: "/images/skills/3_pixel.png",
    },
    {
      title: "Glitch",
      content: "WebGL / ThreeJS",
      src: "/images/skills/0.webp",
      pixelSrc: "/images/skills/0_pixel.png",
    },
  ],
  [
    {
      title: "Kuji",
      content: "ThreeJS / Ineraction",
      src: "/images/skills/5.webp",
      pixelSrc: "/images/skills/5_pixel.png",
    },
    {
      title: "Roll",
      content: "ThreeJS",
      src: "/images/skills/6.webp",
      pixelSrc: "/images/skills/6_pixel.png",
    },
  ],
  [
    {
      title: "Brush",
      content: "WebGL / Mouse",
      src: "/images/skills/7.webp",
      pixelSrc: "/images/skills/7_pixel.png",
    },
    {
      title: "Dot",
      content: "Processing / WebGL / ThreeJS",
      src: "/images/skills/8.webp",
      pixelSrc: "/images/skills/8_pixel.png",
    },
  ],
  [
    {
      title: "Moebius",
      content: "Processing / WebGL / ThreeJS",
      src: "/images/skills/9.webp",
      pixelSrc: "/images/skills/9_pixel.png",
    },
    {
      title: "Painterly",
      content: "Processing / WebGL / ThreeJS",
      src: "/images/skills/10.webp",
      pixelSrc: "/images/skills/10_pixel.png",
    },
  ],
  [
    {
      title: "Pencil",
      content: "Processing / WebGL / ThreeJS",
      src: "/images/skills/11.webp",
      pixelSrc: "/images/skills/11_pixel.png",
    },
    {
      title: "Pixel",
      content: "Processing / WebGL / ThreeJS",
      src: "/images/skills/12.webp",
      pixelSrc: "/images/skills/12_pixel.png",
    },
  ],
];
export const sideMenuData = {
  Home: {
    path: "/",
    desc: "",
    childs: [],
  },
  archives: {
    path: "/archives",
    desc: "Archives",
    childs: [
      {
        path: "/archives/monimo",
        name: "Monimo",
      },
      {
        path: "/archives/lisn",
        name: "Lisn",
      },
      {
        path: "/archives/neweastart",
        name: "Neweast Art",
      },
      {
        path: "/archives/meum",
        name: "Meum",
      },
    ],
  },
  Experiments: {
    path: "/experiments",
    desc: "Experiments",
    childs: [
      {
        name: "Pinball",
        path: "/experiments/pinball",
      },
      {
        name: "Card",
        path: "/experiments/card",
      },
      {
        name: "Burn",
        path: "/experiments/burn",
      },
      {
        name: "Glitch",
        path: "/experiments/glitch",
      },
      {
        name: "Kuji",
        path: "/experiments/kuji",
      },
      {
        name: "Roll",
        path: "/experiments/roll",
      },

      {
        name: "Brush",
        path: "/experiments/brush",
      },
      {
        name: "Dot",
        path: "/experiments/dot",
      },
      {
        name: "Moebius",
        path: "/experiments/moebius",
      },
      {
        name: "Painterly",
        path: "/experiments/painterly",
      },
      {
        name: "Pencil",
        path: "/experiments/pencil",
      },
      {
        name: "Pixel",
        path: "/experiments/pixel",
      },
    ],
  },
};
