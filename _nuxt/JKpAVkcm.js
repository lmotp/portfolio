import{e as h,r as m,p as T,q as O,v as w,c as A,o as R,m as V,s as P,g as M}from"./D4ANIz5k.js";import{W as b,P as F,S as L,ay as D,az as H,v as p,M as y,b as _,D as C,m as U,a as W,aA as B,aB as z,N as g,f as k}from"./BD8dNJ6u.js";import{E as Y,R as q,S as j}from"./D7-TXODE.js";import{u as K}from"./aJe_C5tR.js";import{O as Q}from"./DhYVZotJ.js";import{s as X}from"./DfDmfrbP.js";const $=`#define GLSLIFY 1
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
`,J=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Z=h({__name:"Pencil",setup(I){const s=m(null),r=m(null);let e,o,n,l,i,d,a,v;const S=()=>{if(!s.value)return;const t=window.innerWidth,u=window.innerHeight,c=t/u;e=new b({canvas:s.value}),e.setSize(t,u),e.shadowMap.enabled=!0,n=new F(45,c,1,1e3),n.position.set(10,5,10),l=new Q(n,e.domElement),l.target.set(0,0,0),l.maxPolarAngle=Math.PI/2,o=new L,v=new D,G(),E(),N(),x()},G=()=>{const t=new H(1,.3,200,32),u=new p({color:65280}),c=new y(t,u);c.position.set(0,1,0),c.castShadow=!0,o.add(c);const f=new y(new _(10,10),new p({color:16777215,side:C}));f.receiveShadow=!0,f.rotation.x=-Math.PI/2,f.position.y=-.75,o.add(f)},E=()=>{const t=new U(16777215,1);t.castShadow=!0,t.position.set(2,2,2),t.shadow.mapSize.width=2048,t.shadow.mapSize.height=2048,o.add(t)},N=()=>{a=new W(window.innerWidth,window.innerHeight),a.texture.format=B,a.texture.type=z,a.texture.minFilter=g,a.texture.magFilter=g,a.texture.generateMipmaps=!1,a.stencilBuffer=!1,i=new Y(e);const t=new q(o,n);d=new j({uniforms:{tDiffuse:{value:null},uNormals:{value:null},uResolution:{value:new k(window.innerWidth,window.innerHeight)}},vertexShader:J,fragmentShader:$}),i.addPass(t),i.addPass(d)},x=()=>{r.value=requestAnimationFrame(x),l.update(),e.setRenderTarget(a);const t=o.overrideMaterial;o.overrideMaterial=v,e.render(o,n),o.overrideMaterial=t,o.matrixWorldNeedsUpdate=!0,d.uniforms.uNormals.value=a.texture,e.setRenderTarget(null),i.render()};return T(()=>{O(S)}),w(()=>{r.value&&cancelAnimationFrame(r.value),o&&K(o),i&&i.dispose(),a&&(a.texture.dispose(),a.dispose()),e.renderLists.dispose(),e.dispose()}),(t,u)=>(R(),A("canvas",{ref_key:"processingRef",ref:s},null,512))}}),ie=h({__name:"Pencil",setup(I){const s=V(),{downloadPercent:r}=P(s),e=m(null),o=()=>{e.value=X(()=>{const n=Math.floor(Math.random()*5)+1;r.value+n>=100?(r.value=100,e.value&&clearInterval(e.value)):r.value+=n},25)};return T(()=>{o()}),w(()=>{e.value&&clearInterval(e.value)}),(n,l)=>(R(),M(Z))}});export{ie as default};
