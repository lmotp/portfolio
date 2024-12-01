#define PI 3.1415926535897932384626433832795;

uniform float uTime;
varying vec2 vUv;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float rollFactor = 0.0;

  if(pos.x >= 0.8 && pos.x <= 1.0 && pos.y >= 0.8 && pos.y <= 1.0) {
    float xProgress = (pos.x - 0.8) / 0.2;
    float yProgress = (pos.y - 0.8) / 0.2;

    rollFactor = xProgress * yProgress;

    float angle = rollFactor * PI * 2.0 * sin(uTime);
    float radius = 0.1 * (1.0 - rollFactor);

    pos.x = mix(pos.x, 0.9 + radius * cos(angle), rollFactor);
    pos.z = mix(pos.z, radius * sin(angle), rollFactor);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}