precision highp float;

uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec2 coord = vUv;
  vec4 color = texture2D(uTexture, coord);

  if(color.a < 0.5) {
    discard;
  }

  gl_FragColor = color;
}