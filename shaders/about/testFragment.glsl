#define GLSLIFY 1
uniform float u_time;
uniform float u_ratio;
uniform float u_strength;
uniform float u_cm;
uniform bool u_about;
uniform bool u_transition;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform vec3 u_progress;
uniform sampler2D u_scene1;
uniform sampler2D u_scene2;
uniform sampler2D u_scene3;
uniform sampler2D u_currentScene;
uniform sampler2D u_noiseTexture;
varying vec2 vUv;

float circle(vec2 uv, vec2 pos, vec2 res, float r, float blur) {
  uv -= pos;
  uv.y *= res.y / res.x;
  return 1.0 - smoothstep(r - (r * blur), r + (r * blur), dot(uv, uv) * 4.0);
};

vec2 coverUv(vec2 plane, vec2 image, vec2 textCoord) {
  vec2 s = plane; // Screen    
  vec2 i = image; // Image    
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 uv = textCoord * s / new + offset;
  return uv;
}

vec2 scaleUv(vec2 uv, float scale) {
  uv -= 0.5;
  uv *= scale;
  uv += 0.5;
  return uv;
}

vec4 final = vec4(0.0);
#define M_PI 3.1415926535897932384626433832795

void main() {
  float time = u_time * 0.4;
  vec2 uv = vUv;
  vec2 ratioUv = coverUv(vec2(1.0, 1.0 / u_ratio), vec2(1.0), vUv);
  float scaleP = u_progress.x;// WE NEED IT MORE "NOISY" WHEN IS SMALL
  vec2 noiseUvStart1 = scaleUv(ratioUv, 2.8);
  vec2 noiseUvStart2 = scaleUv(ratioUv, 2.5);//AND LESS WHEN IS BIG
  vec2 noiseUvEnd1 = scaleUv(ratioUv, 1.2);
  vec2 noiseUvEnd2 = scaleUv(ratioUv, 0.9);

  vec2 noiseUv = mix(noiseUvStart1, noiseUvEnd2, scaleP);
  vec2 noiseUv2 = mix(noiseUvStart2, noiseUvEnd1, scaleP);

  vec4 txt1 = texture2D(u_scene1, vUv);
  vec4 txt2 = texture2D(u_scene2, vUv);

  float mixProgress = smoothstep(0.0, 0.5, u_progress.x);
  float mixProgressLong = smoothstep(0.0, 0.8, u_progress.x);

  vec4 noiseTxtStart1 = texture2D(u_noiseTexture, noiseUvStart1 + vec2(-time * 1.5, time * 0.2));
  vec4 noiseTxtStart2 = texture2D(u_noiseTexture, noiseUvStart2 + vec2(-time * 0.1, -time * 1.5));
  vec4 noiseTxtEnd1 = texture2D(u_noiseTexture, noiseUvEnd1 + vec2(-time * 1.5, time * 0.2));
  vec4 noiseTxtEnd2 = texture2D(u_noiseTexture, noiseUvEnd2 + vec2(-time * 0.1, -time * 1.5));// BLEND NOISES

  float n1 = mix(noiseTxtStart1.r, noiseTxtEnd1.r, mixProgress);
  float n2 = mix(noiseTxtStart2.r, noiseTxtEnd2.r, mixProgress);
  float noise = smoothstep(0.0, 0.5, (n1 + n2) * 0.5) - 0.6;
  float ring = circle(uv, u_mouse, u_res, u_progress.x, mix(1.0, 0.4, mixProgress)); // PLAY WITH INTENSITY OF THE CIRCLE TO PIMP THE NOISE WHEN SMALL
  float v = 0.75;

  ring *= (2.0 - v) + mixProgressLong * v;

  float finalMixFactor = smoothstep(0.6, 0.62, noise + ring);
  vec4 scenes = mix(txt2, txt1, finalMixFactor);

  uv.y -= ((sin(uv.x * M_PI) * u_strength) * .25);
  float t = smoothstep(uv.y - fwidth(uv.y), uv.y, u_progress.z);
  final = mix(scenes, texture2D(u_scene3, vUv), t);

  gl_FragColor = final;
}