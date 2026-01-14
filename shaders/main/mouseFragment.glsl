uniform vec2 mousePosition;
uniform vec2 mouseVelocity;
uniform float time;
uniform float aspect;
uniform sampler2D previousFrame;
uniform float decay;
uniform float size;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 uvAspect = vUv;
  uvAspect.x *= aspect;

  vec2 mouse = mousePosition;
  mouse.x *= aspect;

  vec4 prev = texture2D(previousFrame, vUv);

  float dist = distance(uvAspect, mouse);
  float trail = smoothstep(size, 0.0, dist);

  vec3 velocity = vec3(abs(mouseVelocity), 0.0) * 0.5;
  vec3 color = mix(prev.rgb * decay, vec3(velocity.r, velocity.g, 0.0), trail);

  gl_FragColor = vec4(color, 1.0);
}
