import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import * as THREE from "three";

import pencilFragment from "@/shaders/processing/pencilFragment.glsl";
import pencilVertex from "@/shaders/processing/pencilVertex.glsl";

export class PencilLinesPass extends Pass {
  fsQuad: FullScreenQuad;
  material: THREE.ShaderMaterial;
  normalBuffer: THREE.WebGLRenderTarget;
  normalMaterial: THREE.MeshNormalMaterial;
  scene: THREE.Scene;
  camera: THREE.Camera;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    super();

    this.scene = scene;
    this.camera = camera;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uNormals: { value: null },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: pencilVertex,
      fragmentShader: pencilFragment,
    });
    this.fsQuad = new FullScreenQuad(this.material);

    const normalBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    normalBuffer.texture.format = THREE.RGBAFormat;
    normalBuffer.texture.type = THREE.HalfFloatType;
    normalBuffer.texture.minFilter = THREE.NearestFilter;
    normalBuffer.texture.magFilter = THREE.NearestFilter;
    normalBuffer.texture.generateMipmaps = false;
    normalBuffer.stencilBuffer = false;
    this.normalBuffer = normalBuffer;
    this.normalMaterial = new THREE.MeshNormalMaterial();
  }

  override dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  override render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget
  ) {
    renderer.setRenderTarget(this.normalBuffer);
    const overrideMaterialValue = this.scene.overrideMaterial;

    this.scene.overrideMaterial = this.normalMaterial;
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = overrideMaterialValue;

    this.material.uniforms.uNormals.value = this.normalBuffer.texture;
    this.material.uniforms.tDiffuse.value = readBuffer.texture;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }
}
