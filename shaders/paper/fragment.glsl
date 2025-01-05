float PI = 3.141592653589793;
uniform float uScrollY;

varying vec2 vUv;

void main() {
  vec4 color;

  if(gl_FrontFacing)
    color = vec4(1.0, 0.0, 0.0, 1.0); // 앞면은 빨간색
  else
    color = vec4(0.0, 0.0, 1.0, 1.0); // 뒷면은 파란색

  gl_FragColor = color;
}