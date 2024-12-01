uniform float time;

varying vec2 vUv;

void main() {
  vec2 coord = vUv;
  gl_FragColor = vec4(coord, 0., 1.0);
}