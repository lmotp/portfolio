import{W as x,O as _,S as g,l as P,m as S,f as z}from"./BD8dNJ6u.js";import{D as L,G as C}from"./By_ixScT.js";import{O as b}from"./DhYVZotJ.js";import{E as D,R as M,S as R}from"./D7-TXODE.js";import{e as d,r as k,l as F,n as y,c as A,o as m,i as O,g as U}from"./t8Z0vWH_.js";const G=`#define GLSLIFY 1
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
`,V=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,W=d({__name:"Dot",setup(u){const r=k(null);let t,a,n,s,l;const f=()=>{if(!r.value)return;t=new x({canvas:r.value,alpha:!0}),t.setClearColor("#050505"),t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),t.shadowMap.enabled=!0;const o=window.innerWidth/window.innerHeight,e=.8;n=new _(-e*o,e*o,e,-e,.1,1e3),n.position.set(-0,2,-5),s=new b(n,t.domElement),s.enableRotate=!1,s.enableZoom=!1,s.enablePan=!1,a=new g,v(),p(),w(),c()},v=()=>{const o=new L;o.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");const e=new C;e.setDRACOLoader(o),e.load(O("/models/the_creation_of_adam.glb"),async h=>{const i=h.scene;i.position.set(2.25,-2,0),i.rotation.y=-Math.PI/2,i.scale.setScalar(4),await t.compileAsync(i,n,a),a.add(i)})},p=()=>{const o=new P(16777215,.2),e=new S(16777215,8);e.position.set(5,10,-5),a.add(o),a.add(e)},w=()=>{l=new D(t);const o=new M(a,n);l.addPass(o);const e=new R({uniforms:{tDiffuse:{value:null},pixelSize:{value:10},resolution:{value:new z(window.innerWidth,window.innerHeight)}},vertexShader:V,fragmentShader:G});l.addPass(e)},c=()=>{requestAnimationFrame(c),l.render()};return F(()=>{y(f)}),(o,e)=>(m(),A("canvas",{ref_key:"dotRef",ref:r},null,512))}}),Y=d({__name:"Dot",setup(u){return(r,t)=>(m(),U(W))}});export{Y as default};
