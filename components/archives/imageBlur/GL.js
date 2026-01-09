import * as THREE from "three";
import Media from "./Media.js"; // 앞서 변환한 Three.js용 Media 클래스

export default class GL {
  constructor(renderer, scene, isDisposed, blurWrapRef) {
    this.images = [...blurWrapRef.querySelectorAll(".media")];
    this.isDisposed = isDisposed;
    this.renderer = renderer;
    this.scene = scene;

    this.createCamera();

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

  onScroll({ scroll }) {
    if (this.medias) this.medias.forEach((media) => media.onScroll(scroll));
  }

  update() {
    if (this.isDisposed || !this.renderer) return;
    if (this.medias) this.medias.forEach((media) => media.update());

    // Three.js 렌더링 방식
    this.renderer.render(this.scene, this.camera);
    this.animationId = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
