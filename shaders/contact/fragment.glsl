varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform vec2 uCenter;
uniform float uRadius;

void main() {
  vec4 color = texture2D(uTexture, vUv);

  float dist = distance(vUv, uCenter);
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec3 grayColor = vec3(gray);

  vec3 finalColor = mix(grayColor, color.rgb, dist);

  gl_FragColor = vec4(finalColor, 1.0);
}