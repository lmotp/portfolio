varying vec2 vUv;
float PI = 3.141592653589793;

vec3 deformationCurve(vec3 pos, vec2 uv) {
  pos.y = pos.y - (sin(uv.x * PI) * 10.0 * -0.01);

  return pos;
}

void main() {
  vUv = uv;
  vec3 newPosition = deformationCurve(position, uv);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}