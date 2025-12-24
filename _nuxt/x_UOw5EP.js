import{W as x,O as _,S as g,l as P,m as S,V as z}from"./D1v7FCyw.js";import{D as L,G as C}from"./DqAXrD07.js";import{O as D}from"./D9M70cXg.js";import{E as b,R as M,S as R}from"./CPel3THH.js";import{m as d,r as k,n as F,q as y,c as O,o as m,p as U}from"./FTP1zxOV.js";const V=`#define GLSLIFY 1
varying vec2 vUv;

uniform float pixelSize;
uniform vec2 resolution;
uniform sampler2D tDiffuse;

void main() {

  vec2 uv = vUv;
  vec2 normalizedPixelSize = pixelSize / resolution;
  float rowIndex = floor(uv.x / normalizedPixelSize.x);
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(tDiffuse, uvPixel);
  vec2 cellUV = fract(uv / normalizedPixelSize);

  float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
  float radius = luma > 0.5 ? 0.3 : luma > 0.001 ? 0.12 : 0.075;
  vec2 circleCenter = luma > 0.5 ? vec2(0.5, 0.5) : vec2(0.25, 0.25);

  float distanceFromCenter = distance(cellUV, circleCenter);

  float circleMask = smoothstep(radius, radius - 0.05, distanceFromCenter);
  color.rgb = vec3(circleMask, circleMask, circleMask) * max(luma, 0.05);
  gl_FragColor = color;
}
`,A=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,G=d({__name:"Dot",setup(u){const i=k(null);let t,a,n,s,l;const f=()=>{if(!i.value)return;t=new x({canvas:i.value,alpha:!0}),t.setClearColor("#010101"),t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),t.shadowMap.enabled=!0;const o=window.innerWidth/window.innerHeight,e=.8;n=new _(-e*o,e*o,e,-e,.1,1e3),n.position.set(-0,2,-5),s=new D(n,t.domElement),s.enableRotate=!1,s.enableZoom=!1,s.enablePan=!1,a=new g,v(),p(),w(),c()},v=()=>{const o=new L;o.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");const e=new C;e.setDRACOLoader(o),e.load("/models/the_creation_of_adam.glb",async h=>{const r=h.scene;r.position.set(2.25,-2,0),r.rotation.y=-Math.PI/2,r.scale.setScalar(4),await t.compileAsync(r,n,a),a.add(r)})},p=()=>{const o=new P(16777215,.2),e=new S(16777215,8);e.position.set(5,10,-5),a.add(o),a.add(e)},w=()=>{l=new b(t);const o=new M(a,n);l.addPass(o);const e=new R({uniforms:{tDiffuse:{value:null},pixelSize:{value:10},resolution:{value:new z(window.innerWidth,window.innerHeight)}},vertexShader:A,fragmentShader:V});l.addPass(e)},c=()=>{requestAnimationFrame(c),l.render()};return F(()=>{y(f)}),(o,e)=>(m(),O("canvas",{ref_key:"dotRef",ref:i},null,512))}}),q=d({__name:"Dot",setup(u){return(i,t)=>(m(),U(G))}});export{q as default};
