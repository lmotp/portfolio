uniform sampler2D u_metalMatCap;
uniform float uTime;
uniform vec3 uBlue;
uniform float uZMax;

varying vec2 vUv;
varying vec3 vPosition;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: fbm2d = require('glsl-fractal-brownian-noise/2d');
#pragma glslify: fbm3d = require('glsl-fractal-brownian-noise/3d');

float multStep(float signal, float decomp) {
  float outSign = 0.;
  for(float i = 0.; i < decomp; i++) {
    outSign += step((i + 1.) / decomp, signal) * (1. / (decomp - 1.));
  }
  return outSign;
}

void main() {

    // Main Foam
  float bNoise = fbm3d(vec3(vUv.y, vUv.x, uTime * 0.001), 10) * 0.4;
  float sine = sin((vUv.x + bNoise) * 4. - uTime * 0.35 - 3.14);
  sine = mix(0.0, 0.85, (sine + 1.) / 2.);
  sine = multStep(sine, 7.);

  float tbNoise = fbm3d(vec3(vUv.y, vUv.x, uTime * 0.001), 10) * 0.4;
  float triWave = abs(mod(((vUv.x + tbNoise - uTime * 0.02) * 2.), 1.) - .5) * 2.;
  triWave = multStep(triWave, 4.);

    // Floaters
  vec2 stUv = vUv * vec2(5., 20.) + vec2(-uTime * 0.3, 0.);
  float sNoise = snoise3(vec3(stUv, uTime * 0.05));
  sNoise *= 3.;
  sNoise -= 1.5;
  sNoise = clamp(sNoise, .0, 1.);
  sNoise = multStep(sNoise, 3.);

  vec3 outCol = mix(uBlue, vec3(1.), sine);
  outCol += sNoise;
  gl_FragColor = vec4(outCol, 1.);
}