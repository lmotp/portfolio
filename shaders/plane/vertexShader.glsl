uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normal;
  vPosition = position;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float wave = sin(modelPosition.x * uFrequency + uTime) * uAmplitude;
  modelPosition.z += wave;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}