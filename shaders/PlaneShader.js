import * as THREE from "three";

export const PlaneShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uScale;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      gl_FragColor = texture2D(uTexture, uv);
    }
  `,
};
