uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec4 color = texture2D(uTexture, uv);
  vec3 bgColor = vec3(0.0, 0.50196, 0.50196);
  vec3 finalColor = vec3(color.a == 0.0 ? bgColor : color.rgb);

  gl_FragColor = vec4(finalColor, 1.0);
}