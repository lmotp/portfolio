import{e as V,r as S,p as H,v as Y,c as $,o as j,m as J,s as K,q as N,g as Z}from"./D4ANIz5k.js";import{W as ee,P as te,S as y,a as C,M as s,b as _,c as d,B as re,O as ne,d as oe,V as ae,D as le,e as se,f as ie,R as ce}from"./BD8dNJ6u.js";import{u as ve}from"./aJe_C5tR.js";import{s as ue}from"./DfDmfrbP.js";const fe=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,de=`#define GLSLIFY 1
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform sampler2D tPrev;
uniform vec4 uResolution;
uniform float uTime;

#define PI 3.1415926535897932384626433832795

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
  return res * res;
}

float fbm(vec2 x, int numOctaves) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100);
	// Rotate to reduce axial bias

  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for(int i = 0; i < numOctaves; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float blendDarken(float base, float blend) {
  return min(blend, base);
}

vec3 blendDarken(vec3 base, vec3 blend) {
  return vec3(blendDarken(base.r, blend.r), blendDarken(base.g, blend.g), blendDarken(base.b, blend.b));
}

vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
  return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}

float hue2rgb(float f1, float f2, float hue) {
  if(hue < 0.0)
    hue += 1.0;
  else if(hue > 1.0)
    hue -= 1.0;
  float res;
  if((6.0 * hue) < 1.0)
    res = f1 + (f2 - f1) * 6.0 * hue;
  else if((2.0 * hue) < 1.0)
    res = f2;
  else if((3.0 * hue) < 2.0)
    res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
  else
    res = f1;
  return res;
}

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb;

  if(hsl.y == 0.0) {
    rgb = vec3(hsl.z); // Luminance
  } else {
    float f2;

    if(hsl.z < 0.5)
      f2 = hsl.z * (1.0 + hsl.y);
    else
      f2 = hsl.z + hsl.y - hsl.y * hsl.z;

    float f1 = 2.0 * hsl.z - f2;

    rgb.r = hue2rgb(f1, f2, hsl.x + (1.0 / 3.0));
    rgb.g = hue2rgb(f1, f2, hsl.x);
    rgb.b = hue2rgb(f1, f2, hsl.x - (1.0 / 3.0));
  }
  return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
  return hsl2rgb(vec3(h, s, l));
}

vec3 bgColor = vec3(1.0);

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  vec4 prev = texture2D(tPrev, vUv);

  vec2 aspect = vec2(1.0, uResolution.y / uResolution.x);
  vec2 disp = fbm(vUv * 22.0, 4) * aspect * 0.01;

  vec4 texel = texture2D(tPrev, vUv);
  vec4 texel2 = texture2D(tPrev, vec2(vUv.x + disp.x, vUv.y));
  vec4 texel3 = texture2D(tPrev, vec2(vUv.x - disp.x, vUv.y));
  vec4 texel4 = texture2D(tPrev, vec2(vUv.x, vUv.y + disp.y));
  vec4 texel5 = texture2D(tPrev, vec2(vUv.x, vUv.y - disp.y));

  vec3 floodColor = texel.rgb;
  floodColor = blendDarken(floodColor, texel2.rgb);
  floodColor = blendDarken(floodColor, texel3.rgb);
  floodColor = blendDarken(floodColor, texel4.rgb);
  floodColor = blendDarken(floodColor, texel5.rgb);

  vec3 gardient = hsl2rgb(fract(uTime * 0.1), 0.5, 0.5);
  vec3 lColor = mix(vec3(1.0), gardient, color.r);

  vec3 waterColor = blendDarken(prev.rgb, floodColor * (1.0 + 0.02), 0.7);
  vec3 finalColor = blendDarken(waterColor, lColor, 1.0);

  gl_FragColor = vec4(finalColor, 1.0);
  gl_FragColor = vec4(min(bgColor, finalColor * (1.0 + 0.01) + 0.001), 1.0);
}`,me=V({__name:"Brush",setup(q){const i=S(null),c=S(null),r=new ie,m=new ce,t=window.innerWidth,n=window.innerHeight;let U=0,e,v,b,h,u,P,T,B,L,G,z,I,k,o,p,g,x,R,f,E,F,w,M;const A=()=>{i.value&&(e=new ee({canvas:i.value,antialias:!0,alpha:!1}),e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.setSize(t,n),v=new te(70,t/n,.1,1e3),v.position.set(0,0,2),b=new y,h=new C(t,n),u=new y,P=new s(new _(100,100),new d({color:16777215})),P.position.set(0,0,-1),u.add(P),T=new s(new re(.3,.3,.3),new d({color:65280})),u.add(T),Q(),X(),O())},Q=()=>{g=new C(t,n),o=new C(t,n),p=new C(t,n),e.setRenderTarget(h),e.render(u,v),x=new y,R=new ne(-1,1,1,-1,0,1),E=new _(2,2),f=new oe({uniforms:{tDiffuse:{value:null},tPrev:{value:h.texture},uTime:{value:0},uResolution:{value:new ae(t,n,1,1)}},vertexShader:fe,fragmentShader:de}),F=new s(E,f),x.add(F),w=new y,M=new s(new _(2,2),new d({map:o.texture})),w.add(M)},X=()=>{B=new _(100,100,32,32),L=new d({color:16776960,side:le}),G=new s(B,L),z=new se(.2,20,20),I=new d({color:16777215}),k=new s(z,I),b.add(k),window.addEventListener("mousemove",W)},W=a=>{r.x=a.clientX/window.innerWidth*2-1,r.y=-(a.clientY/window.innerHeight)*2+1,m.setFromCamera(r,v);const D=m.intersectObject(G);D.length>0&&k.position.copy(D[0].point)},O=()=>{c.value=requestAnimationFrame(O),U+=.05,e.setRenderTarget(g),e.render(b,v),e.setRenderTarget(o),e.render(x,R),f.uniforms.tDiffuse.value=g.texture,f.uniforms.tPrev.value=o.texture,f.uniforms.uTime.value=U,M.material.map=o.texture,e.setRenderTarget(null),e.render(w,R);let a=o;o=p,p=a};return H(()=>{A()}),Y(()=>{window.removeEventListener("mousemove",W),[b,u,x,w].forEach(l=>{l&&ve(l)}),[h,g,o,p].forEach(l=>{l&&(l.texture.dispose(),l.dispose())}),e.renderLists.dispose(),e.dispose()}),(a,D)=>(j(),$("canvas",{ref_key:"brushRef",ref:i},null,512))}}),xe=V({__name:"Brush",setup(q){const i=J(),{downloadPercent:c}=K(i),r=S(null),m=()=>{r.value=ue(()=>{const t=Math.floor(Math.random()*5)+1;c.value+t>=100?(c.value=100,r.value&&clearInterval(r.value)):c.value+=t},25)};return H(()=>{N(m)}),Y(()=>{r.value&&clearInterval(r.value)}),(t,n)=>(j(),Z(me))}});export{xe as default};
