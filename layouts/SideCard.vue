<script setup lang="ts">
import gsap from "gsap";
const copiedList = ref<string[]>([]);

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

const handleClickCopy = (text: string, type: string) => {
  navigator.clipboard.writeText(text).then(() => {
    if (copiedList.value.includes(type)) return;

    copiedList.value.push(type);

    setTimeout(() => {
      copiedList.value = copiedList.value.filter((item) => item !== type);
    }, 2000);
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="namecard">
    <img class="profile-img" src="@/public/images/profile.jpg" alt="" />
    <strong class="job">Publisher</strong>
    <h3 class="name">박철순</h3>

    <div class="line"></div>

    <div class="icon">
      <button @click="handleClickCopy('unoeye22@gmail.com', 'mail')"><Icon name="basil:envelope-solid" size="14" style="color: #ffffff" /></button>
      <button @click="handleClickCopy('010-5408-6369', 'phone')"><Icon name="basil:phone-solid" size="14" style="color: #ffffff" /></button>
    </div>

    <div class="info">
      <p>{{copiedList.includes('phone') ? "Copied" : "010-5408-6369"}}</p>
      <p>{{copiedList.includes('mail') ? "Copied" : "unoeye22@gmail.com"}}</p>
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
    object-fit: cover;
    border-radius: 50%;
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

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #3c352d;
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
