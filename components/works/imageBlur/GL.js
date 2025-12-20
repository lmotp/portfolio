import * as THREE from "three";
import Media from "./Media.js"; // 앞서 변환한 Three.js용 Media 클래스

export default class GL {
  constructor(renderer, blurWrapRef) {
    this.images = [...blurWrapRef.querySelectorAll(".media")];

    this.renderer = renderer;

    this.createCamera();
    this.createScene();

    this.onResize();

    this.createGeometry();
    this.createMedias();

    this.update();

    this.addEventListeners();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createGeometry() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 50);
  }

  createMedias() {
    this.medias = this.images.map((item) => {
      return new Media({
        renderer: this.renderer,
        geometry: this.planeGeometry,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        $el: item,
        img: item.querySelector("img"),
      });
    });
  }

  onResize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);

    // 카메라 투영 행렬 업데이트
    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    // 뷰포트 계산 (DOM과 WebGL 좌표 일치를 위함)
    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height,
      width,
    };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({
          screen: this.screen,
          viewport: this.viewport,
        })
      );
      this.onScroll({ scroll: window.scrollY });
    }
  }

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  onScroll({ scroll }) {
    if (this.medias) {
      this.medias.forEach((media) => media.onScroll(scroll));
      this.checkHeroProgress(scroll);
    }
  }

  checkHeroProgress(scroll) {
    const p = this.easeInOut(Math.min(scroll / (this.screen.height * 0.57), 1));
    let height = this.medias[0].$el.offsetHeight;
    const scale = 1 + 0.05 * p;

    this.medias[0].setScale(null, height * scale);
    this.medias[0].blurStrength = 1 - 0.8 * (1 - p);
  }

  update() {
    if (this.medias) {
      this.medias.forEach((media) => media.update());
    }

    // Three.js 렌더링 방식
    this.renderer.render(this.scene, this.camera);

    this.animationId = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
