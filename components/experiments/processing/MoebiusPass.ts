import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import * as THREE from "three";

import moebiusFragment from "@/shaders/processing/moebiusFragment.glsl";
import moebiusVertex from "@/shaders/processing/moebiusVertex.glsl";

export class MoebiusPass extends Pass {
  fsQuad: FullScreenQuad;
  material: THREE.ShaderMaterial;
  camera: THREE.PerspectiveCamera;
  depthRenderTarget: THREE.WebGLRenderTarget;

  constructor(camera: THREE.PerspectiveCamera, depthRenderTarget: THREE.WebGLRenderTarget) {
    super();

    this.camera = camera;
    this.depthRenderTarget = depthRenderTarget;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uDepth: { value: null },
        cameraNear: { value: null },
        cameraFar: { value: null },
      },
      vertexShader: moebiusVertex,
      fragmentShader: moebiusFragment,
    });
    this.fsQuad = new FullScreenQuad(this.material);
  }

  override dispose() {
    this.fsQuad.dispose();
    this.material.dispose();
  }

  override render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget
  ) {
    this.material.uniforms.tDiffuse.value = readBuffer.texture;
    this.material.uniforms.uDepth.value = this.depthRenderTarget.depthTexture;
    this.material.uniforms.cameraNear.value = this.camera.near;
    this.material.uniforms.cameraFar.value = this.camera.far;

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
