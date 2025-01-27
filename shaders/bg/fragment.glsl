uniform float time;
uniform sampler2D uTexture;

varying vec2 vUv;
#define PI 3.1415926535897932384626433832795

void main() {
  vec2 coord = vUv;
  vec4 image = texture2D(uTexture, vUv);
  gl_FragColor = image;
  // gl_FragColor = vec4(coord, 0., 1.0);
}
