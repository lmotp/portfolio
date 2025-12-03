varying vec2 vUv;

uniform float pixelSize;
uniform vec2 resolution;
uniform sampler2D tDiffuse;

void main() {

  vec2 uv = vUv;
  vec2 normalizedPixelSize = pixelSize / resolution;
  float rowIndex = floor(uv.x / normalizedPixelSize.x);
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(tDiffuse, uvPixel);
  vec2 cellUV = fract(uv / normalizedPixelSize);

  float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
  float radius = luma > 0.5 ? 0.3 : luma > 0.001 ? 0.12 : 0.075;
  vec2 circleCenter = luma > 0.5 ? vec2(0.5, 0.5) : vec2(0.25, 0.25);

  float distanceFromCenter = distance(cellUV, circleCenter);

  float circleMask = smoothstep(radius, radius - 0.05, distanceFromCenter);
  color.rgb = vec3(circleMask, circleMask, circleMask) * max(luma, 0.05);
  gl_FragColor = color;
}
