#define SECTOR_COUNT 4

uniform int kernelSize;
uniform sampler2D tDiffuse;
uniform vec4 resolution;

varying vec2 vUv;

vec3 sampleColor(vec2 offset) {
  vec2 coord = (gl_FragCoord.xy + offset) / resolution.xy;
  return texture2D(tDiffuse, coord).rgb;
}

void getSectorVarianceAndAverageColor(vec2 offset, int boxSize, out vec3 avgColor, out float variance) {
  vec3 colorSum = vec3(0.0);
  vec3 squaredColorSum = vec3(0.0);
  float sampleCount = 0.0;

  for(int y = 0; y < boxSize; y++) {
    for(int x = 0; x < boxSize; x++) {
      vec2 sampleOffset = offset + vec2(float(x), float(y));
      vec3 color = sampleColor(sampleOffset);
      colorSum += color;
      squaredColorSum += color * color;
      sampleCount += 1.0;
    }
  }

    // Calculate average color and variance
  avgColor = colorSum / sampleCount;
  vec3 varianceRes = (squaredColorSum / sampleCount) - (avgColor * avgColor);
  variance = dot(varianceRes, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec3 boxAvgColors[SECTOR_COUNT];
  float boxVariances[SECTOR_COUNT];

  getSectorVarianceAndAverageColor(vec2(-kernelSize, -kernelSize), kernelSize, boxAvgColors[0], boxVariances[0]);
  getSectorVarianceAndAverageColor(vec2(0, -kernelSize), kernelSize, boxAvgColors[1], boxVariances[1]);
  getSectorVarianceAndAverageColor(vec2(-kernelSize, 0), kernelSize, boxAvgColors[2], boxVariances[2]);
  getSectorVarianceAndAverageColor(vec2(0, 0), kernelSize, boxAvgColors[3], boxVariances[3]);

  float minVariance = boxVariances[0];
  vec3 finalColor = boxAvgColors[0];

  for(int i = 1; i < SECTOR_COUNT; i++) {
    if(boxVariances[i] < minVariance) {
      minVariance = boxVariances[i];
      finalColor = boxAvgColors[i];
    }
  }

  gl_FragColor = vec4(finalColor, 1.0);
}