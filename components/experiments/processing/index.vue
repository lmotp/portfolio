<script setup lang="ts">
const options = [
  {
    id: 0,
    icon: "fas fa-walking",
    main: "Pencil",
    sub: "Omuke trughte a otufta",
    image: "https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg",
  },
  {
    id: 1,
    icon: "fas fa-snowflake",
    main: "Moebius",
    sub: "Omuke trughte a otufta",
    image: "https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg",
  },
  {
    id: 2,
    icon: "fas fa-tree",
    main: "Pixel",
    sub: "Omuke trughte a otufta",
    image: "https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg",
  },
  {
    id: 3,
    icon: "fas fa-tint",
    main: "Dot",
    sub: "Omuke trughte a otufta",
    image: "https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg",
  },
  {
    id: 4,
    icon: "fas fa-sun",
    main: "Inatethi",
    sub: "Omuke trughte a otufta",
    image: "https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg",
  },
];
const optionDefaultColours = ["#ED5565", "#FC6E51", "#FFCE54", "#2ECC71", "#5D9CEC", "#AC92EC"];

const activeOption = ref(0);

const handleOptionClick = (optionId: number, optionName: string) => {
  if (activeOption.value === optionId) {
    useRouter().push(`/experiments/processing/${optionName}`);
  }

  activeOption.value = optionId;
};
</script>

<template>
  <div class="processing-container">
    <div class="options">
      <div
        v-for="option in options"
        :key="option.id"
        :class="['option', option.id === activeOption ? 'active' : '']"
        :style="{
          '--optionBackground': `url(${option.image})`,
          '--defaultBackground': optionDefaultColours[option.id],
        }"
        @click="handleOptionClick(option.id, option.main.toLowerCase())"
      >
        <div class="shadow"></div>

        <div class="label">
          <div class="icon">
            <i :class="option.icon"></i>
          </div>

          <p class="info">
            <strong class="main">{{ option.main }}</strong>
            <span class="sub">{{ option.sub }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.processing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100dvh;
  background-color: #232223;

  .options {
    display: flex;

    overflow: hidden;

    min-width: 600px;
    max-width: 900px;
    width: calc(100% - 100px);

    height: 400px;

    .option {
      position: relative;
      overflow: hidden;
      min-width: 60px;
      margin: 10px;
      background: var(--optionBackground, var(--defaultBackground, #e6e9ed));
      background-size: auto 120%;
      background-position: center;

      cursor: pointer;

      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);

      &.active {
        flex-grow: 10000;
        transform: scale(1);

        max-width: 600px;
        margin: 0px;
        border-radius: 40px;
        background-size: auto 100%;

        .shadow {
          box-shadow: inset 0 -120px 120px -120px black, inset 0 -120px 120px -100px black;
        }

        .label {
          bottom: 20px;
          left: 20px;

          .info > p {
            left: 0px;
            opacity: 1;
          }
        }
      }

      &:not(.active) {
        flex-grow: 1;
        border-radius: 30px;

        .shadow {
          bottom: -40px;
          box-shadow: inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
        }

        .label {
          bottom: 10px;
          left: 10px;

          .info > p {
            left: 20px;
            opacity: 0;
          }
        }
      }

      .shadow {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;

        height: 120px;

        transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
      }
      .label {
        display: flex;
        position: absolute;
        right: 0px;
        height: 40px;
        transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);

        .icon {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          min-width: 40px;
          max-width: 40px;
          height: 40px;
          border-radius: 100%;

          background-color: var(--defaultBackground);
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;

          margin-left: 10px;

          color: white;

          white-space: pre;

          > p {
            position: relative;

            transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity 0.5s ease-out;
          }

          .main {
            font-weight: bold;
            font-size: 1.2rem;
          }

          .sub {
            transition-delay: 0.1s;
          }
        }
      }
    }
  }
}
</style>
