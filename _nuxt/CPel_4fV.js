import{e as u,r as d,p as v,q as S,v as f,c as z,o as p,m as L,s as C,g as D}from"./D4ANIz5k.js";import{W as M,O as b,S as R,l as k,m as F,f as I}from"./BD8dNJ6u.js";import{D as A,G as U}from"./By_ixScT.js";import{O as y}from"./DhYVZotJ.js";import{E as O,R as G,S as T}from"./D7-TXODE.js";import{u as V}from"./Cz3nu93G.js";import{u as W}from"./aJe_C5tR.js";import{s as E}from"./DfDmfrbP.js";const B=`#define GLSLIFY 1
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
`,H=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,q=u({__name:"Dot",setup(w){const r=d(null),s=d(null);let e,a,n,i,l;const h=()=>{if(!r.value)return;e=new M({canvas:r.value,alpha:!0}),e.setClearColor("#050505"),e.setSize(window.innerWidth,window.innerHeight),e.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),e.shadowMap.enabled=!0;const t=window.innerWidth/window.innerHeight,o=.8;n=new b(-o*t,o*t,o,-o,.1,1e3),n.position.set(-0,2,-5),i=new y(n,e.domElement),i.enableRotate=!1,i.enableZoom=!1,i.enablePan=!1,a=new R,x(),g(),P(),m()},x=()=>{const t=new A;t.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");const o=new U;o.setDRACOLoader(t),o.load(V("/models/the_creation_of_adam.glb"),async _=>{const c=_.scene;c.position.set(2.25,-2,0),c.rotation.y=-Math.PI/2,c.scale.setScalar(4),await e.compileAsync(c,n,a),a.add(c)})},g=()=>{const t=new k(16777215,.2),o=new F(16777215,8);o.position.set(5,10,-5),a.add(t),a.add(o)},P=()=>{l=new O(e);const t=new G(a,n);l.addPass(t);const o=new T({uniforms:{tDiffuse:{value:null},pixelSize:{value:10},resolution:{value:new I(window.innerWidth,window.innerHeight)}},vertexShader:H,fragmentShader:B});l.addPass(o)},m=()=>{s.value=requestAnimationFrame(m),l.render()};return v(()=>{S(h)}),f(()=>{s.value&&cancelAnimationFrame(s.value),a&&W(a),l.dispose(),e.renderLists.dispose(),e.dispose()}),(t,o)=>(p(),z("canvas",{ref_key:"dotRef",ref:r},null,512))}}),X=u({__name:"Dot",setup(w){const r=L(),{downloadPercent:s}=C(r),e=d(null),a=()=>{e.value=E(()=>{const n=Math.floor(Math.random()*5)+1;s.value+n>=100?(s.value=100,e.value&&clearInterval(e.value)):s.value+=n},25)};return v(()=>{a()}),f(()=>{e.value&&clearInterval(e.value)}),(n,i)=>(p(),D(q))}});export{X as default};
