import{e as C,r as x,p as L,q as F,v as S,c as N,o as R,m as W,s as j,g as A}from"./D4ANIz5k.js";import{f as U,W as B,a as E,S as T,O as Y,P as q,T as H,N as z,b as _,d as D,M as k,C as V}from"./BD8dNJ6u.js";import{u as O}from"./Cz3nu93G.js";import{u as M}from"./aJe_C5tR.js";import{s as $}from"./DfDmfrbP.js";const J=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,K=`#define GLSLIFY 1
uniform vec2 resolution;
uniform vec2 imageResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main(void) {
  vec2 ratio = vec2(min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0), min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0));
  vec2 coord = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);

  vec4 color = texture2D(uTexture, coord);

  gl_FragColor = color;
}`,Q=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Z=`precision highp float;
#define GLSLIFY 1

uniform float time;
uniform vec2 resolution;
uniform sampler2D uTexture;

varying vec2 vUv;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g_0 = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g_0;
  vec3 i1 = min( g_0.xyz, l.zxy );
  vec3 i2 = max( g_0.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

const float interval = 3.0;

float random(vec2 c) {
  return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
  float strength = smoothstep(interval * 0.5, interval, interval - mod(time, interval));
  vec2 shake = vec2(strength * 8.0 + 0.5) * vec2(random(vec2(time)) * 2.0 - 1.0, random(vec2(time * 2.0)) * 2.0 - 1.0) / resolution;

  float y = vUv.y * resolution.y;
  float rgbWave = (snoise(vec3(0.0, y * 0.01, time * 400.0)) * (2.0 + strength * 32.0) * snoise(vec3(0.0, y * 0.02, time * 200.0)) * (1.0 + strength * 4.0) + step(0.9995, sin(y * 0.005 + time * 1.6)) * 12.0 + step(0.9999, sin(y * 0.005 + time * 2.0)) * -18.0) / resolution.x;
  float rgbDiff = (6.0 + sin(time * 500.0 + vUv.y * 40.0) * (20.0 * strength + 1.0)) / resolution.x;
  float rgbUvX = vUv.x + rgbWave;
  float r = texture2D(uTexture, vec2(rgbUvX + rgbDiff, vUv.y) + shake).r;
  float g = texture2D(uTexture, vec2(rgbUvX, vUv.y) + shake).g;
  float b = texture2D(uTexture, vec2(rgbUvX - rgbDiff, vUv.y) + shake).b;

  float whiteNoise = (random(vUv + mod(time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

  float bnTime = floor(time * 20.0) * 200.0;
  float noiseX = step((snoise(vec3(0.0, vUv.x * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
  float noiseY = step((snoise(vec3(0.0, vUv.y * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
  float bnMask = noiseX * noiseY;
  float bnUvX = vUv.x + sin(bnTime) * 0.2 + rgbWave;
  float bnR = texture2D(uTexture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask;
  float bnG = texture2D(uTexture, vec2(bnUvX, vUv.y)).g * bnMask;
  float bnB = texture2D(uTexture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask;
  vec4 blockNoise = vec4(bnR, bnG, bnB, 1.0);

  float bnTime2 = floor(time * 25.0) * 300.0;
  float noiseX2 = step((snoise(vec3(0.0, vUv.x * 2.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.5);
  float noiseY2 = step((snoise(vec3(0.0, vUv.y * 8.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.3);
  float bnMask2 = noiseX2 * noiseY2;
  float bnR2 = texture2D(uTexture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask2;
  float bnG2 = texture2D(uTexture, vec2(bnUvX, vUv.y)).g * bnMask2;
  float bnB2 = texture2D(uTexture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask2;
  vec4 blockNoise2 = vec4(bnR2, bnG2, bnB2, 1.0);

  float waveNoise = (sin(vUv.y * 1200.0) + 1.0) / 2.0 * (0.15 + strength * 0.2);

  gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - bnMask - bnMask2) + (whiteNoise + blockNoise + blockNoise2 - waveNoise);
}`,ee=C({__name:"Glitch",setup(G){const s=x(null),t=x(new U(document.body.clientWidth,window.innerHeight)),o=x(null),m=new V;let e,i,r,l,v,u,y,f,g,d,p,c,b;const I=()=>{if(!s.value)return;e=new B({antialias:!1,canvas:s.value}),i=new E(t.value.x,t.value.y),e.setSize(t.value.x,t.value.y),e.setPixelRatio(window.devicePixelRatio),e.setClearColor(921102,1),r=new T,l=new Y(-1,1,1,-1,-1e3,1e3),l.position.set(0,0,2),v=new T,u=new q(45,window.innerWidth/window.innerHeight,1,2),new H().load(O("/images/experiments/glitch/osaka.jpg"),a=>{d=a,a.magFilter=z,a.minFilter=z,g=P(a),b=X(a),v.add(g),r.add(b)})},P=n=>(y=new _(2,2,64,64),f=new D({uniforms:{resolution:{value:t.value},imageResolution:{value:new U(2048,1356)},uTexture:{value:n}},vertexShader:J,fragmentShader:K}),new k(y,f)),X=n=>(p=new _(2,2),c=new D({uniforms:{time:{value:0},resolution:{value:t.value},uTexture:{value:n}},vertexShader:Q,fragmentShader:Z}),new k(p,c)),h=()=>{t.value.set(window.innerWidth,window.innerHeight),f.uniforms.resolution.value.set(window.innerWidth,window.innerHeight),c.uniforms.resolution.value.set(window.innerWidth,window.innerHeight),u.aspect=t.value.x/t.value.y,u.updateProjectionMatrix(),e.setSize(t.value.x,t.value.y),i.setSize(t.value.x,t.value.y)},w=()=>{o.value=requestAnimationFrame(w);const n=m.getDelta();c&&(c.uniforms.time.value+=n),e.render(r,l),e.setRenderTarget(i),e.render(v,u),e.setRenderTarget(null),e.render(r,l)};return L(()=>{F(()=>{I(),w(),window.addEventListener("resize",h)})}),S(()=>{window.removeEventListener("resize",h),o.value&&cancelAnimationFrame(o.value),r&&M(r),v&&M(v),i&&i.dispose(),d&&d.dispose(),e.renderLists.dispose(),e==null||e.dispose()}),(n,a)=>(R(),N("canvas",{ref_key:"glitchRef",ref:s},null,512))}}),ae=C({__name:"Glitch",setup(G){const s=W(),{downloadPercent:t}=j(s),o=x(null),m=()=>{o.value=$(()=>{const e=Math.floor(Math.random()*5)+1;t.value+e>=100?(t.value=100,o.value&&clearInterval(o.value)):t.value+=e},25)};return L(()=>{m()}),S(()=>{o.value&&clearInterval(o.value)}),(e,i)=>(R(),A(ee))}});export{ae as default};
