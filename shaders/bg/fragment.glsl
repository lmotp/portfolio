uniform float uTime;
uniform sampler2D uTexture; // 기본 텍스처
uniform sampler2D uNoise;   // 노이즈 텍스처
uniform vec2 uMouse;        // 마우스 위치 (UV 좌표)
uniform vec2 uResolution;   // 화면 해상도

varying vec2 vUv;

void main() {
    // 화면 종횡비 조정
  float aspect = uResolution.x / uResolution.y;
  vec2 adjustedUv = vUv;
  adjustedUv.x *= aspect;

    // 기본 텍스처 샘플링
  vec4 baseColor = texture2D(uTexture, vUv);

    // 노이즈 텍스처 샘플링
  vec4 noise = texture2D(uNoise, vUv * 5.0 + uTime * 0.1);

    // 마우스와의 거리 계산
  float dist = length(adjustedUv - uMouse);

    // 확산 효과: 주변 픽셀 샘플링 및 평균화
  vec4 diffusion = vec4(0.0);
  float spread = 0.01 + uTime * 0.02; // 시간에 따라 확산 범위 증가
  for(int i = -1; i <= 1; i++) {
    for(int j = -1; j <= 1; j++) {
      vec2 offset = vec2(float(i), float(j)) * spread;
      diffusion += texture2D(uTexture, vUv + offset);
    }
  }
  diffusion /= 9.0; // 평균화

    // 노이즈 기반 경계 생성
  float mask = smoothstep(0.3, 0.7, noise.r) * (1.0 - smoothstep(0.0, 0.2, dist));

    // 최종 색상 혼합: 기본 색상과 확산 색상을 마스크로 조합
  vec4 finalColor = mix(baseColor, diffusion, mask);

  gl_FragColor = finalColor;
}
