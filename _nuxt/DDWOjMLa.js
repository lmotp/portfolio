import{e as j,r as s,p as E,q as J,v as B,c as K,o as W,m as X,s as Z,g as ee}from"./D4ANIz5k.js";import{f as T,G as ie,S as ae,P as te,g as C,W as oe,T as ne,h as z,b as _,d as b,M as N,A,i as se,j as re,k as ve,C as le}from"./BD8dNJ6u.js";import{u as D}from"./Cz3nu93G.js";import{u as me}from"./aJe_C5tR.js";import{s as ue}from"./DfDmfrbP.js";const ce=`#define GLSLIFY 1
uniform float time;
uniform float easeTransition;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;
varying vec2 vUpdateUv;
varying float vTime;

void main(void) {
  vec2 updateUv = uv * imgRatio + vec2((1.0 - imgRatio.x) * 0.5, (1.0 - imgRatio.y) * 0.5);

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(noiseTex, uv * vec2(0.998) + 0.001).b;

  float mask = easeTransition * 1.6 - slide;
  float maskPrev = smoothstep(0.0, 0.3, mask);
  float maskNext = 1.0 - smoothstep(0.3, 0.6, mask);
  float height = maskPrev * maskNext * 4.0;

  vec4 mPosition = modelMatrix * vec4(position + vec3(0.0, 0.0, height), 1.0);

  vPosition = position;
  vUv = uv;
  vUpdateUv = updateUv;
  vTime = easeTransition;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,ge=`precision highp float;
#define GLSLIFY 1

uniform float time;
uniform float easeTransition;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;
uniform sampler2D imgPrevTex;
uniform sampler2D imgNextTex;

varying vec3 vPosition;
varying vec2 vUv;
varying vec2 vUpdateUv;
varying float vTime;

void main() {
  vec2 ratio = vec2(min(imgRatio.x / imgRatio.y / 3.0 * 2.0, 1.0), min(imgRatio.y / imgRatio.x / 2.0 * 3.0, 1.0) / 3.0 * 2.0);
  vec2 imgUv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);

  float noiseR = texture2D(noiseTex, vUpdateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, vUpdateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(noiseTex, vUv * vec2(0.998) + 0.001).b;

  float mask = vTime * 1.24 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2);
  float maskPrev = 1.0 - smoothstep(0.12, 0.16, mask);
  float maskNext = smoothstep(0.16, 0.2, mask);
  float maskEdge = smoothstep(0.04, 0.12, mask) * (1.0 - smoothstep(0.2, 0.28, mask));

  vec4 imgPrev = texture2D(imgPrevTex, imgUv * (0.95 - 0.05 * easeTransition) + 0.025 + 0.025 * easeTransition);
  vec4 imgNext = texture2D(imgNextTex, imgUv * (1.0 - 0.05 * easeTransition) + 0.025 * easeTransition);

  // 0.9 - 0.8
  // 1.0 - 0.9

  vec3 color1 = imgPrev.rgb * maskPrev;
  vec3 color2 = imgNext.rgb * maskNext;
  vec3 color3 = vec3(0.0, 0.2, 1.0) * maskEdge;

  gl_FragColor = vec4(color1 + color2 - color3, 1.0);
}`,fe=`#define GLSLIFY 1
uniform float time;
uniform float easeTransition;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vTime;

void main(void) {
  vec2 p = uv * 2.0 - 1.0;
  float edge = abs(p.x);

  vec2 updateUv = uv * imgRatio + vec2((1.0 - imgRatio.x) * 0.5, (1.0 - imgRatio.y) * 0.5);

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(noiseTex, uv * vec2(0.998) + 0.001).b;

  float mask = easeTransition * 1.24 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2);
  float h1 = (1.0 - smoothstep(0.14, 0.24, mask)) * 12.0;

  float mask2 = easeTransition * 1.6 - slide;
  float maskPrev = smoothstep(0.0, 0.3, mask2);
  float maskNext = 1.0 - smoothstep(0.3, 0.6, mask2);
  float h2 = maskPrev * maskNext * 8.0;

  float h = h1 + h2;

  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position + vec3(slide * 0.2, slide * 0.2 + h * 0.006, h), 1.0);

  float opacity = smoothstep(0.0, 2.0, h1) * (1.0 - smoothstep(8.0, 12.0, h1)) * (1.0 - pow(edge, 2.0));

  vPosition = mPosition.xyz;
  vUv = uv;
  vOpacity = opacity;
  vTime = easeTransition;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,de=`precision highp float;
#define GLSLIFY 1

uniform float time;
uniform float duration;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vTime;

void main() {
  vec2 updateUv = vUv * imgRatio + vec2((1.0 - imgRatio.x) * 0.5, (1.0 - imgRatio.y) * 0.5);

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;

  gl_FragColor = vec4(1.0, 0.38, 0.0, vOpacity * smoothstep(0.4, 0.6, noiseR));
}`,pe=`#define GLSLIFY 1
uniform float time;
uniform float easeTransition;
uniform sampler2D noiseTex;
uniform vec2 imgRatio;
uniform float pixelRatio;

varying float vOpacity;

void main(void) {
  vec2 updateUv = uv * imgRatio + vec2((1.0 - imgRatio.x) * 0.5, (1.0 - imgRatio.y) * 0.5);

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(noiseTex, uv * vec2(0.99) + 0.005).b;

  float mask = easeTransition * 1.24 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2);
  float h = (easeTransition - slide) * 30.0;

  float opacity = smoothstep(0.3, 0.5, easeTransition * 2.0 - slide) * (1.0 - smoothstep(0.8, 1.0, easeTransition * 2.0 - slide)) * 0.8;

  vec4 mPosition = modelMatrix * vec4(position + vec3(cos(radians(noiseR * 360.0 + time * 200.0)) * 0.1, sin(radians(noiseG * 360.0 + time * 200.0)) * 0.1, h), 1.0);

  float distanceFromCamera = length((viewMatrix * mPosition).xyz);
  float pointSize = pixelRatio * 50.0 / distanceFromCamera * 4.0;

  vOpacity = opacity;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
  gl_PointSize = pointSize;
}`,xe=`precision highp float;
#define GLSLIFY 1

varying float vOpacity;

void main() {
  // Convert PointCoord to the other vec2 has a range from -1.0 to 1.0.
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  // Draw circle
  float radius = length(p);
  float opacity = (1.0 - smoothstep(0.5, 1.0, radius));

  // Define Colors
  vec3 color = vec3(1.0, 0.38, 0.0);

  gl_FragColor = vec4(color, opacity * vOpacity);
}`;function he(d){return(d/=.5)<1?.5*Math.pow(d,2):-.5*((d-=2)*d-2)}const O=3,Te=j({__name:"Burn",setup(d){const y=s(null),u=s(null),o=s(0),i=s(new T),c=s(0),g=s(1);let P,t,n,F,r,M,I,p,R,U,x,k,Y=new le,v=s(null),f=s([]),w=new ie;const V=async()=>{if(!y.value)return;P=new ae,t=new te,t.aspect=3/2,t.far=1e3,t.setFocalLength(50),t.position.set(0,0,50),t.lookAt(new C),n=new oe({antialias:!0,alpha:!0,canvas:y.value}),n.setSize(window.innerWidth,window.innerHeight),n.setPixelRatio(window.devicePixelRatio),n.setClearColor(921102,1);const e=new ne;await Promise.all([e.loadAsync(D("/images/experiments/burn/noise.png")),e.loadAsync(D("/images/experiments/burn/image01.jpg")),e.loadAsync(D("/images/experiments/burn/image02.jpg")),e.loadAsync(D("/images/experiments/burn/image03.jpg"))]).then(a=>{v.value=a[0],f.value=a.slice(1),v.value.wrapS=z,v.value.wrapT=z,M=q(v.value),k=Q(v.value),R=H(v.value),R.renderOrder=10,k.position.z=5,w.add(M),w.add(R),w.add(k),P.add(w)})},q=e=>{F=new _(1,1,64,64),r=new b({uniforms:{time:{value:0},easeTransition:{value:0},noiseTex:{value:e},imgPrevTex:{value:f.value[c.value]},imgNextTex:{value:f.value[g.value]},imgRatio:{value:new T}},vertexShader:ce,fragmentShader:ge});const a=new N(F,r);return a.name="plane",a},H=e=>{I=new _(1,1,128,128),p=new b({uniforms:{time:{value:0},easeTransition:{value:0},noiseTex:{value:e},imgRatio:{value:new T}},vertexShader:fe,fragmentShader:de,transparent:!0,blending:A});const a=new N(I,p);return a.name="fire",a},Q=e=>{const a=new _(1,1,32,32);U=new se,U.setAttribute("position",a.attributes.position),U.setAttribute("uv",a.attributes.uv),x=new b({uniforms:{time:{value:0},easeTransition:{value:0},noiseTex:{value:e},imgRatio:{value:new T},pixelRatio:{value:window.devicePixelRatio}},vertexShader:pe,fragmentShader:xe,transparent:!0,blending:A});const l=new re(U,x);return l.name="points",l},$=()=>{c.value=g.value,g.value=g.value+1>=f.value.length?0:g.value+1,r.uniforms.imgPrevTex.value=f.value[c.value],r.uniforms.imgNextTex.value=f.value[g.value]},G=()=>{i.value.set(document.body.clientWidth,window.innerHeight),t.aspect=i.value.x/i.value.y,t.updateProjectionMatrix(),n.setSize(i.value.x,i.value.y);const e=ve.degToRad(t.fov),a=Math.abs((t.position.z-w.position.z)*Math.tan(e/2)*2),l=a*t.aspect,S=new T,m=new C;S.set(i.value.x>i.value.y?i.value.y*.2:i.value.x*.1,i.value.x>i.value.y?i.value.y*.2:i.value.y*.333),m.set(l*(i.value.x-S.x)/i.value.x,a*(i.value.y-S.y)/i.value.y,1);const h=new T(Math.min(1,m.x/m.y),Math.min(1,m.y/m.x));r.uniforms.imgRatio.value.set(h.x,h.y),p.uniforms.imgRatio.value.set(h.x,h.y),x.uniforms.imgRatio.value.set(h.x,h.y),M.scale.copy(m),R.scale.copy(m),k.scale.copy(m)},L=()=>{u.value=requestAnimationFrame(L);let e=Y.getDelta();o.value+=e;const a=o.value/O>=1,l=a?0:he(Math.min(o.value/O,1));a?(o.value=0,$(),r.uniforms.easeTransition.value=0,x.uniforms.easeTransition.value=0,p.uniforms.easeTransition.value=0):(r.uniforms.easeTransition.value=l,x.uniforms.easeTransition.value=l,p.uniforms.easeTransition.value=l),r.uniforms.time.value+=e,x.uniforms.time.value+=e,p.uniforms.time.value+=e,n.render(P,t)};return E(()=>{J(async()=>{await V(),G(),L(),window.addEventListener("resize",G)})}),B(()=>{window.removeEventListener("resize",G),u.value&&cancelAnimationFrame(u.value),P&&me(P),v.value&&v.value.dispose(),f.value.forEach(e=>e.dispose()),n.renderLists.dispose(),n==null||n.dispose()}),(e,a)=>(W(),K("canvas",{ref_key:"burnRef",ref:y},null,512))}}),ke=j({__name:"Burn",setup(d){const y=X(),{downloadPercent:u}=Z(y),o=s(null),i=()=>{o.value=ue(()=>{const c=Math.floor(Math.random()*5)+1;u.value+c>=100?(u.value=100,o.value&&clearInterval(o.value)):u.value+=c},25)};return E(()=>{i()}),B(()=>{o.value&&clearInterval(o.value)}),(c,g)=>(W(),ee(Te))}});export{ke as default};
