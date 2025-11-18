precision highp float;

uniform sampler2D uTexture;
uniform float uThreshold;

varying vec2 vUv;

float getLuminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec3 color = texture2D(uTexture, vUv).rgb;
  float lum = getLuminance(color);
  float finalValue = smoothstep(uThreshold - 0.01, uThreshold + 0.01, lum);

  gl_FragColor = vec4(vec3(finalValue), 1.0);
}
