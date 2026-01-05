<script setup lang="ts">
import gsap from "gsap";

const init = () => {
  gsap.to(".namecard", {
    duration: 2,
    rotate: 360 * 2,
    top: "50%",
    left: "50%",
    translateX: "-50%",
    translateY: "-50%",
    scale: 1,
    ease: "power3.inOut",
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="namecard">
    <img class="profile-img" src="https://i.imgur.com/SMfYDvL.png" />
    <strong class="job">Publisher</strong>
    <h3 class="name">박철순</h3>

    <div class="line"></div>

    <div class="icon">
      <img class="ig" src="https://i.imgur.com/9ZZwYaU.png" alt="" />
      <img class="mail" src="https://i.imgur.com/Rk00gq9.png" alt="" />
    </div>

    <div class="info">
      <p>Publisher:arkell.shen</p>
      <p>unoeye22@gmail.com</p>
    </div>
  </div>
</template>

<style scoped>
.namecard {
  position: absolute;
  top: 100%;
  left: 350px;
  transform: scale(0.5);

  padding: 20px;
  background-color: var(--beige);
  color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  border: solid 1px rgba(0, 0, 0, 0.15);
  border-radius: 6px;

  letter-spacing: 1px;
  box-shadow: 0px 25px 15px -20px rgba(0, 0, 0, 0.2);

  .profile-img {
    width: 200px;
    height: 200px;
    max-width: initial;
    z-index: 1;
  }

  .job {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 14px;
    font-weight: 700;
    color: var(--black);
    text-transform: uppercase;
    writing-mode: vertical-lr;

    z-index: 2;
  }

  .name {
    margin-top: 15px;
    font-size: 16px;
    font-weight: 700;
    color: var(--black);
    text-align: center;
  }

  .line {
    position: relative;
    left: 50%;
    margin-top: 10px;
    width: 10px;
    height: 1px;
    background-color: var(--black);
    transform: translateX(-50%);
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-top: 30px;

    > * {
      width: 20px;
      height: 20px;
    }
  }

  .info {
    margin-top: 10px;

    p {
      text-align: center;
      font-size: 8px;
      color: var(--black);
    }
  }
}

@media screen and (max-width: 768px) {
}
</style>
