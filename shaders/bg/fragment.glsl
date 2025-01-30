uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoise;

varying vec2 vUv;
#define PI 3.1415926535897932384626433832795

void main() {
  vec4 image = texture2D(uTexture, vUv);
  vec4 noise = texture2D(uNoise, vUv);

  // 그레이스케일 계산
  float gray = dot(image.rgb, vec3(0.299, 0.587, 0.114));
  vec4 grayImage = vec4(vec3(gray), image.a);

  float smoothness = 0.05;
  float progress = uTime * 0.3;
  progress = clamp(progress, 0.0, 1.0); // 진행도를 0과 1 사이로 제한

  // 노이즈 텍스처에 따라 색상 전환
  float threshold = noise.r - smoothness;
  float alpha = smoothstep(threshold, threshold + 1.0 * smoothness, progress);

  // 그레이스케일 이미지와 원본 이미지를 혼합
  gl_FragColor = mix(grayImage, image, alpha);
}
