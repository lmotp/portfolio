import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import * as THREE from "three";

import pencilFragment from "@/shaders/processing/pencilFragment.glsl";
import pencilVertex from "@/shaders/processing/pencilVertex.glsl";

export class PencilLinesPass extends Pass {
  fsQuad: FullScreenQuad;
  material: THREE.ShaderMaterial;

  constructor() {
    super();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: pencilVertex,
      fragmentShader: pencilFragment,
    });
    this.fsQuad = new FullScreenQuad(this.material);
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
    this.material.uniforms["tDiffuse"].value = readBuffer.texture;

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
