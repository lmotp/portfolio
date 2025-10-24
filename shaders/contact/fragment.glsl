varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uRadius;

float circle(in vec2 _st, in float _radius) {
  vec2 dist = _st - vec2(0.5);
  return 1. - smoothstep(_radius - (_radius * 0.01), _radius + (_radius * 0.01), dot(dist, dist) * 4.0);
}

void main() {
  float ratio = uResolution.x / uResolution.y;
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  st.x *= ratio;

  vec4 textureColor = texture2D(uTexture, vUv);

  float gray = dot(textureColor.rgb, vec3(0.1, 0.1, 0.1));
  vec3 grayColor = vec3(gray);

  vec3 color = mix(grayColor, textureColor.rgb, circle(st, 0.25));

  gl_FragColor = vec4(color, 1.0);
}