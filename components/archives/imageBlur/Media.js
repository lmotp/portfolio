import * as THREE from "three";
import blurVertex from "~/shaders/blur/blurVertex.glsl";
import blurFragment from "~/shaders/blur/blurFragment.glsl";

export default class Media {
  constructor({ geometry, scene, renderer, screen, viewport, $el, img }) {
    // Three.js에서는 gl 대신 renderer를 주로 참조합니다.
    this.renderer = renderer;
    this.geometry = geometry;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.img = img;
    this.$el = $el;

    this.scroll = 0;
    this.blurStrength = 1;

    this.createShader();
    this.createMesh();

    this.onResize();
  }

  createShader() {
    // 1. Texture 로더 사용 (Three.js 방식)
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(this.img.src, (tex) => {
      // 이미지 로드 완료 후 사이즈 업데이트
      this.material.uniforms.uImageSize.value.set(tex.image.naturalWidth, tex.image.naturalHeight);
    });

    texture.generateMipmaps = false;

    // 2. OGL의 Program -> Three.js의 ShaderMaterial
    this.material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      vertexShader: blurVertex,
      fragmentShader: blurFragment,
      uniforms: {
        tMap: { value: texture },
        uPlaneSize: { value: new THREE.Vector2(0, 0) },
        uImageSize: { value: new THREE.Vector2(0, 0) },
        uViewportSize: { value: new THREE.Vector2(this.viewport.width, this.viewport.height) },
        uTime: { value: 100 * Math.random() },
        uBlurStrength: { value: this.blurStrength },
      },
      transparent: true,
    });
  }

  createMesh() {
    // OGL의 Mesh와 Three.js의 Mesh는 거의 동일합니다.
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  onScroll(scroll) {
    this.scroll = scroll;
    this.setY(this.y);
  }

  update() {
    this.material.uniforms.uTime.value += 0.04;
    this.material.uniforms.uBlurStrength.value = this.blurStrength;
  }

  setScale(x, y) {
    x = x || this.img.offsetWidth;
    y = y || this.img.offsetHeight;

    // Three.js의 scale 객체 사용
    this.mesh.scale.x = (this.viewport.width * x) / this.screen.width;
    this.mesh.scale.y = (this.viewport.height * y) / this.screen.height;

    // 유니폼 값 업데이트
    this.material.uniforms.uPlaneSize.value.set(this.mesh.scale.x, this.mesh.scale.y);
  }

  setX(x = 0) {
    this.x = x;
    this.mesh.position.x =
      -(this.viewport.width / 2) + this.mesh.scale.x / 2 + (this.x / this.screen.width) * this.viewport.width;
  }

  setY(y = 0) {
    this.y = y;
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.y - this.scroll) / this.screen.height) * this.viewport.height;
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;

    if (viewport) {
      this.viewport = viewport;
      this.material.uniforms.uViewportSize.value.set(this.viewport.width, this.viewport.height);
    }

    this.setScale();
    this.setX(this.$el.offsetLeft);
    this.setY(this.$el.offsetTop);
  }
}
