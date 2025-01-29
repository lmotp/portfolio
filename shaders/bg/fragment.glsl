uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoise;

varying vec2 vUv;
#define PI 3.1415926535897932384626433832795

void main() {
  vec4 image = texture2D(uTexture, vUv);
  vec4 noise = texture2D(uNoise, vUv);

  float smoothness = 0.05;
  float progress = uTime * 0.3;
  progress += progress * smoothness;

  float alpha = smoothstep(noise.x - smoothness, noise.x, progress);

  image.w *= alpha;

  gl_FragColor = image;
}
