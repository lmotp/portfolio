uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture;

varying vec2 vUv;

#include "./includes/coverUV.glsl"
#include "./includes/perlin3dNoise.glsl"

void main() {
  vec2 uv = vUv;

  vec2 displacedUv = uv + cnoise(vec3(uv * 5.0, uTime * 0.1));
  float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));
  float radialGradient = distance(vUv, vec2(0.5)) * 12.5 - 7.0 * uProgress;
  strength += radialGradient;
  strength = clamp(strength, 0.0, 1.0);
  strength = 1.0 - strength;

  float opacity = strength * smoothstep(0.0, 0.7, uProgress);

  vec4 color = texture2D(uTexture, uv);
  vec3 bgColor = vec3(0.0, 0.50196, 0.50196);
  vec3 finalColor = vec3(color.a == 0.0 ? bgColor : color.rgb);

  gl_FragColor = vec4(finalColor, 1.0);
}