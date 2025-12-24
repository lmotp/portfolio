import{W as I,P as G,S as E,ay as N,az as O,v as x,M as v,b as V,D as A,m as b,a as P,aA as M,aB as F,N as y,V as L}from"./D1v7FCyw.js";import{E as D,R as H,S as _}from"./CPel3THH.js";import{m as p,r as C,n as U,q as W,c as B,o as h,p as z}from"./FTP1zxOV.js";import{O as k}from"./D9M70cXg.js";const Y=`#define GLSLIFY 1
uniform sampler2D tDiffuse;
uniform sampler2D uNormals;
uniform sampler2D uTexture;

uniform vec2 uResolution;

varying vec2 vUv;

// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org
vec2 grad(ivec2 z)  // replace this anything that returns a random vector
{
    // 2D to 1D  (feel free to replace by some other)
  int n = z.x + z.y * 11111;

    // Hugo Elias hash (feel free to replace by another one)
  n = (n << 13) ^ n;
  n = (n * (n * n * 15731 + 789221) + 1376312589) >> 16;

    // Perlin style vectors
  n &= 7;
  vec2 gr = vec2(n & 1, n >> 1) * 2.0 - 1.0;
  return (n >= 6) ? vec2(0.0, gr.x) : (n >= 4) ? vec2(gr.x, 0.0) : gr;
}

float noise(in vec2 p) {
  ivec2 i = ivec2(floor(p));
  vec2 f = fract(p);

  vec2 u = f * f * (3.0 - 2.0 * f); // feel free to replace by a quintic smoothstep instead

  return mix(mix(dot(grad(i + ivec2(0, 0)), f - vec2(0.0, 0.0)), dot(grad(i + ivec2(1, 0)), f - vec2(1.0, 0.0)), u.x), mix(dot(grad(i + ivec2(0, 1)), f - vec2(0.0, 1.0)), dot(grad(i + ivec2(1, 1)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float valueAtPoint(sampler2D image, vec2 coord, vec2 texel, vec2 point) {
  vec3 luma = vec3(0.299, 0.587, 0.114);

  return dot(texture2D(image, coord + texel * point).xyz, luma);
}

float diffuseValue(int x, int y) {
  float cutoff = 40.0;
  float offset = 0.5 / cutoff;
  float noiseValue = clamp(texture(uTexture, vUv).r, 0.0, cutoff) / cutoff - offset;

  return valueAtPoint(tDiffuse, vUv + noiseValue, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.6;
}

float normalValue(int x, int y) {
  float cutoff = 50.0;
  float offset = 0.5 / cutoff;
  float noiseValue = clamp(texture(uTexture, vUv).r, 0.0, cutoff) / cutoff - offset;

  return valueAtPoint(uNormals, vUv + noiseValue, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.3;
}

float getValue(int x, int y) {
  float noiseValue = noise(gl_FragCoord.xy);
  noiseValue = noiseValue * 2.0 - 1.0;
  noiseValue *= 10.0;

  return diffuseValue(x, y) + normalValue(x, y) * noiseValue;
}

float combinedSobelValue() {
    // kernel definition (in glsl matrices are filled in column-major order)
  const mat3 Gx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);// x direction kernel
  const mat3 Gy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);// y direction kernel

    // fetch the 3x3 neighbourhood of a fragment

    // first column
  float tx0y0 = getValue(-1, -1);
  float tx0y1 = getValue(-1, 0);
  float tx0y2 = getValue(-1, 1);

    // second column
  float tx1y0 = getValue(0, -1);
  float tx1y1 = getValue(0, 0);
  float tx1y2 = getValue(0, 1);

    // third column
  float tx2y0 = getValue(1, -1);
  float tx2y1 = getValue(1, 0);
  float tx2y2 = getValue(1, 1);

    // gradient value in x direction
  float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
    Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
    Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

    // gradient value in y direction
  float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
    Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
    Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

    // magnitude of the total gradient
  float G = (valueGx * valueGx) + (valueGy * valueGy);
  return clamp(G, 0.0, 1.0);
}

void main() {
  float sobelValue = combinedSobelValue();
  sobelValue = smoothstep(0.01, 0.03, sobelValue);

  vec4 lineColor = vec4(0.32, 0.12, 0.2, 1.0);

  if(sobelValue > 0.1) {
    gl_FragColor = lineColor;
  } else {
    gl_FragColor = vec4(1.0);
  }
}
`,q=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,j=p({__name:"Pencil",setup(g){const l=C(null);let o,t,n,s,u,f,a,d;const w=()=>{if(!l.value)return;const e=window.innerWidth,r=window.innerHeight,i=e/r;o=new I({canvas:l.value}),o.setSize(e,r),o.shadowMap.enabled=!0,n=new G(45,i,1,1e3),n.position.set(10,5,10),s=new k(n,o.domElement),s.target.set(0,0,0),s.maxPolarAngle=Math.PI/2,t=new E,d=new N,T(),R(),S(),m()},T=()=>{const e=new O(1,.3,200,32),r=new x({color:65280}),i=new v(e,r);i.position.set(0,1,0),i.castShadow=!0,t.add(i);const c=new v(new V(10,10),new x({color:16777215,side:A}));c.receiveShadow=!0,c.rotation.x=-Math.PI/2,c.position.y=-.75,t.add(c)},R=()=>{const e=new b(16777215,1);e.castShadow=!0,e.position.set(2,2,2),e.shadow.mapSize.width=2048,e.shadow.mapSize.height=2048,t.add(e)},S=()=>{a=new P(window.innerWidth,window.innerHeight),a.texture.format=M,a.texture.type=F,a.texture.minFilter=y,a.texture.magFilter=y,a.texture.generateMipmaps=!1,a.stencilBuffer=!1,u=new D(o);const e=new H(t,n);f=new _({uniforms:{tDiffuse:{value:null},uNormals:{value:null},uResolution:{value:new L(window.innerWidth,window.innerHeight)}},vertexShader:q,fragmentShader:Y}),u.addPass(e),u.addPass(f)},m=()=>{requestAnimationFrame(m),s.update(),o.setRenderTarget(a);const e=t.overrideMaterial;t.overrideMaterial=d,o.render(t,n),t.overrideMaterial=e,t.matrixWorldNeedsUpdate=!0,f.uniforms.uNormals.value=a.texture,o.setRenderTarget(null),u.render()};return U(()=>{W(w)}),(e,r)=>(h(),B("canvas",{ref_key:"processingRef",ref:l},null,512))}}),J=p({__name:"Pencil",setup(g){return(l,o)=>(h(),z(j))}});export{J as default};
