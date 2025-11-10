import{V as u,a as l,W as L,S as M,P as b,M as d,T as P,b as S,c as T,d as D}from"./usuuJ63N.js";import{u as p}from"./B9eREMlO.js";import{O as I}from"./CX86noqU.js";import{m as E,r as F,n as W,p as k,o as g,c as B,a as G,q as H}from"./DiC925tN.js";import{_ as x}from"./DlAUqK2U.js";const N=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,U=`#define GLSLIFY 1
varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uRadius;

float circle(in vec2 _st, in float _radius) {
  vec2 dist = _st - vec2(0.5);
  return 1. - smoothstep(_radius - (_radius * 0.01), _radius + (_radius * 0.01), dot(dist, dist) * 4.0);
}

void main() {
  float ratio = uResolution.x / uResolution.y;
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  st.x *= ratio;

  vec4 textureColor = texture2D(uTexture, vUv);

  float gray = dot(textureColor.rgb, vec3(0.1, 0.1, 0.1));
  vec3 grayColor = vec3(gray);

  vec3 color = mix(grayColor, textureColor.rgb, circle(st, 0.25));

  gl_FragColor = vec4(color, 1.0);
}`,V=E({__name:"index",setup(h){const a=F(null),r=new l(-10,-29,-1/0),y=new l(10,29,1/0),i=new l,s=new u;let m,v,f,t,n,c,e;const C=()=>{if(!a.value)return;t=new L({canvas:a.value,antialias:!0,alpha:!0}),t.setPixelRatio(window.devicePixelRatio),t.setSize(window.innerWidth,window.innerHeight),t.setClearColor(16711680,1),c=new M,n=new b(45,window.innerWidth/window.innerHeight,.1,1e3),n.position.set(0,0,50),e=new I(n,t.domElement),e.enableZoom=!1,e.enableRotate=!1,e.enableDamping=!0,e.mouseButtons={LEFT:d.PAN,MIDDLE:d.DOLLY,RIGHT:d.PAN},e.addEventListener("change",()=>{i.copy(e.target),e.target.clamp(r,y),i.sub(e.target),n.position.sub(i)});const o=new P;o.load(p("/images/contact/cover.jpg"),w=>{m=new S(100,100,32,32),v=new T({uniforms:{uTexture:{value:w},uNoise:{value:o.load(p("/images/contact/noise.jpg"))},uMouse:{value:s},uCenter:{value:new u(.5,.5)},uRadius:{value:.35},uResolution:{value:new u(window.innerWidth,window.innerHeight)}},vertexShader:N,fragmentShader:U}),f=new D(m,v),c.add(f)})},R=o=>{s.x=o.clientX/window.innerWidth*2-1,s.y=-(o.clientY/window.innerHeight)*2+1},_=()=>{t.render(c,n),e.update(),requestAnimationFrame(_)};return W(()=>{k(()=>{C(),_()})}),(o,w)=>(g(),B("div",{class:"contact",onMousemove:R},[G("canvas",{ref_key:"cotactRef",ref:a},null,512)],32))}}),A=x(V,[["__scopeId","data-v-23820ec9"]]),O={};function Y(h,a){const r=A;return g(),H(r)}const $=x(O,[["render",Y]]);export{$ as default};
