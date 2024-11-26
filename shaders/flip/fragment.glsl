uniform float time;
uniform vec2 progress;

varying vec2 vUv;

void main() {
  vec2 coord = vUv;
  gl_FragColor = vec4(progress, 0., 1.0);
}