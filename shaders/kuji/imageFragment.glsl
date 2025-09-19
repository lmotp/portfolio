precision highp float;

uniform vec2 imgRatio;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec2 coord = vUv;
  vec4 color = texture2D(uTexture, coord);

  gl_FragColor = color;
}