varying vec2 vUv;

void main() {
  vec3 startColor = vec3(0.0, 0.5, 1.0); // 파란색
  vec3 endColor = vec3(0.8, 0.9, 1.0);   // 밝은 파란색 또는 흰색
  float mixRatio = vUv.y;

  vec3 color = mix(startColor, endColor, mixRatio);

  gl_FragColor = vec4(color, 1.);
}