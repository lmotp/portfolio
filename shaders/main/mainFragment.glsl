uniform sampler2D mouseTrailTexture;
uniform vec2 mouse;
uniform vec2 mouseDirection;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec4 mouseTrailOG = texture2D(mouseTrailTexture, uv);
  float distanceToCenter = 1. - distance(uv, mouse);

  float pixelSize = 32.0 + length(mouseTrailOG.rg) * distanceToCenter;
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 mouseTrail = texture2D(mouseTrailTexture, uvPixel);

  vec2 textureUV = uv;
  textureUV -= mouseTrail.rg * distanceToCenter * mouseDirection;

  vec4 color = texture2D(inputBuffer, textureUV);
  vec4 trailColor = vec4(0.9, 0.9, 0.9, 0.1);
  outputColor = max(color, mix(color, trailColor, mouseTrail.r));
}
