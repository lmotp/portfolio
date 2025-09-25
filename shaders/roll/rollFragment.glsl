uniform float time;
uniform float progress;
uniform vec4 resolution;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vFrontShadow;

void main() {
  vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);

  gl_FragColor = texture2D(uTexture, newUV);
  gl_FragColor.rgb *= vFrontShadow;

}