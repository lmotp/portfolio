uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;
#define PI 3.1415926535897932384626433832795

void main() {
  // 화면 종횡비 계산
  float aspect = uResolution.x / uResolution.y;

  // 종횡비를 고려한 UV 좌표 조정
  vec2 adjustedUv = vUv;
  adjustedUv.x *= aspect;

  vec2 adjustedMouse = uMouse;
  adjustedMouse.x *= aspect;

  vec4 image = texture2D(uTexture, vUv);
  vec4 noise = texture2D(uNoise, vUv);

  // 그레이스케일 계산
  float gray = dot(image.rgb, vec3(0.299, 0.587, 0.114));
  vec4 grayImage = vec4(vec3(gray), image.a);

  // 마우스와 현재 픽셀 간 거리 계산 (종횡비 고려)
  float dist = length(adjustedUv - adjustedMouse);

  // 확산 효과
  float spread = 0.005 * sin(uTime * 2.0);
  vec4 blur = vec4(0.0);
  for(int i = -1; i <= 1; i++) {
    for(int j = -1; j <= 1; j++) {
      vec2 offset = vec2(float(i), float(j)) * spread;
      blur += texture2D(uTexture, vUv + offset);
    }
  }
  blur /= 9.0;

  // 노이즈 기반 경계 생성
  float edge = smoothstep(0.3, 0.7, noise.r);

  // 마우스 인터랙션
  float radius = 0.2;
  float smoothness = 0.05;
  float mask = 1.0 - smoothstep(radius - smoothness, radius, dist);

  // 최종 혼합
  vec4 coloredArea = mix(grayImage, blur, edge * mask);
  gl_FragColor = mix(grayImage, coloredArea, mask);
}
