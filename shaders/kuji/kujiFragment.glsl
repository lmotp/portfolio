precision highp float;

uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec2 coord = vUv;
  vec4 color = vec4(coord, .0, 1.0);

  gl_FragColor = color;
}