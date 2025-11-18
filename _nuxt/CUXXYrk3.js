import{V as f,G as q,S as H,P as Q,g as I,W as $,h as J,i as L,a as M,b as _,M as C,A as z,j as K,k as X,l as Z,C as ee}from"./Dmytbkr3.js";import{u as w}from"./C7vw3ofb.js";import{m as A,r as d,n as ie,p as te,q as ae,o as O,c as oe,y as ne}from"./Dc6rEite.js";const se=`#define GLSLIFY 1
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
}`,re=`precision highp float;
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
}`,ve=`#define GLSLIFY 1
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
}`,me=`precision highp float;
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
}`,le=`#define GLSLIFY 1
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
}`,ue=`precision highp float;
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
}`;function ce(r){return(r/=.5)<1?.5*Math.pow(r,2):-.5*((r-=2)*r-2)}const N=3,ge=A({__name:"Burn",setup(r){const y=d(null),p=d(0),t=d(new f),R=d(0),v=d(1);let U,o,m,b,n,k,F,l,h,T,u,P,j=new ee,c=d([]),x=new q;const B=async()=>{if(!y.value)return;U=new H,o=new Q,o.aspect=3/2,o.far=1e3,o.setFocalLength(50),o.position.set(0,0,50),o.lookAt(new I),m=new $({antialias:!0,alpha:!0,canvas:y.value}),m.setSize(window.innerWidth,window.innerHeight),m.setPixelRatio(window.devicePixelRatio),m.setClearColor(921102,1);const e=new J;await Promise.all([e.loadAsync(w("/images/experiments/burn/noise.png")),e.loadAsync(w("/images/experiments/burn/image01.jpg")),e.loadAsync(w("/images/experiments/burn/image02.jpg")),e.loadAsync(w("/images/experiments/burn/image03.jpg"))]).then(i=>{const a=i[0];c.value=i.slice(1),a.wrapS=L,a.wrapT=L,k=E(a),P=W(a),h=V(a),h.renderOrder=10,P.position.z=5,x.add(k),x.add(h),x.add(P),U.add(x)})},E=e=>{b=new M(1,1,64,64),n=new _({uniforms:{time:{value:0},easeTransition:{value:0},noiseTex:{value:e},imgPrevTex:{value:c.value[R.value]},imgNextTex:{value:c.value[v.value]},imgRatio:{value:new f}},vertexShader:se,fragmentShader:re});const i=new C(b,n);return i.name="plane",i},V=e=>{F=new M(1,1,128,128),l=new _({uniforms:{time:{value:0},easeTransition:{value:0},noiseTex:{value:e},imgRatio:{value:new f}},vertexShader:ve,fragmentShader:me,transparent:!0,blending:z});const i=new C(F,l);return i.name="fire",i},W=e=>{const i=new M(1,1,32,32);T=new K,T.setAttribute("position",i.attributes.position),T.setAttribute("uv",i.attributes.uv),u=new _({uniforms:{time:{value:0},easeTransition:{value:0},noiseTex:{value:e},imgRatio:{value:new f},pixelRatio:{value:window.devicePixelRatio}},vertexShader:le,fragmentShader:ue,transparent:!0,blending:z});const a=new X(T,u);return a.name="points",a},Y=()=>{R.value=v.value,v.value=v.value+1>=c.value.length?0:v.value+1,n.uniforms.imgPrevTex.value=c.value[R.value],n.uniforms.imgNextTex.value=c.value[v.value]},D=()=>{t.value.set(document.body.clientWidth,window.innerHeight),o.aspect=t.value.x/t.value.y,o.updateProjectionMatrix(),m.setSize(t.value.x,t.value.y);const e=Z.degToRad(o.fov),i=Math.abs((o.position.z-x.position.z)*Math.tan(e/2)*2),a=i*o.aspect,G=new f,s=new I;G.set(t.value.x>t.value.y?t.value.y*.2:t.value.x*.1,t.value.x>t.value.y?t.value.y*.2:t.value.y*.333),s.set(a*(t.value.x-G.x)/t.value.x,i*(t.value.y-G.y)/t.value.y,1);const g=new f(Math.min(1,s.x/s.y),Math.min(1,s.y/s.x));n.uniforms.imgRatio.value.set(g.x,g.y),l.uniforms.imgRatio.value.set(g.x,g.y),u.uniforms.imgRatio.value.set(g.x,g.y),k.scale.copy(s),h.scale.copy(s),P.scale.copy(s)},S=()=>{requestAnimationFrame(S);let e=j.getDelta();p.value+=e;const i=p.value/N>=1,a=i?0:ce(Math.min(p.value/N,1));i?(p.value=0,Y(),n.uniforms.easeTransition.value=0,u.uniforms.easeTransition.value=0,l.uniforms.easeTransition.value=0):(n.uniforms.easeTransition.value=a,u.uniforms.easeTransition.value=a,l.uniforms.easeTransition.value=a),n.uniforms.time.value+=e,u.uniforms.time.value+=e,l.uniforms.time.value+=e,m.render(U,o)};return ie(()=>{te(async()=>{await B(),D(),S(),window.addEventListener("resize",D)})}),ae(()=>{window.removeEventListener("resize",D)}),(e,i)=>(O(),oe("canvas",{ref_key:"burnRef",ref:y},null,512))}}),xe=A({__name:"Burn",setup(r){return(y,p)=>(O(),ne(ge))}});export{xe as default};
