varying vec2 vUv;

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) -
    smoothstep(pct, pct + 0.02, st.y);
}

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float reverseUv = 1.0 - uv.x;
  float y = pow(reverseUv, 5.0);

  float pct = plot(uv, y);

  modelPosition.z += reverseUv * 10.0;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}