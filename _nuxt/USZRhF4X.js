import{m as z,u as U,s as V,r as v,n as W,p as E,q as T,o as R,c as k,a as A,v as B,x as C,y as q}from"./Dc6rEite.js";import{G as D,W as F,S as G,P as H,T as Y,a as N,b as j,V as m,M as X}from"./Dmytbkr3.js";import{_ as O}from"./DlAUqK2U.js";const Q=""+new URL("6.DkRzaik8.webp",import.meta.url).href,Z=""+new URL("1.DO8A11Ar.webp",import.meta.url).href,$=""+new URL("2.rLZpYlb9.webp",import.meta.url).href,J=""+new URL("3.DnR6LxEX.webp",import.meta.url).href,K=""+new URL("4.aO_MQVsC.webp",import.meta.url).href,ee=""+new URL("5.BjFEcPVy.webp",import.meta.url).href,ae=`precision highp float;
#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,te=`precision highp float;
#define GLSLIFY 1

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform vec2 uViewportSize;
uniform float uTime;
uniform sampler2D tMap;

varying vec2 vUv;

/*
  by @arthurstammet
  https://shadertoy.com/view/tdXXRM
*/
float tvNoise(vec2 p, float ta, float tb) {
  return fract(sin(p.x * ta + p.y * tb) * 5678.);
}
vec3 draw(sampler2D image, vec2 uv) {
  return texture2D(image, vec2(uv.x, uv.y)).rgb;
}
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
/*
  inspired by https://www.shadertoy.com/view/4tSyzy
  @anastadunbar
*/
vec3 blur(vec2 uv, sampler2D image, float blurAmount) {
  vec3 blurredImage = vec3(0.);
  float gradient = smoothstep(0.0, 1.0, 2.0 - (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y);

  #define repeats 40.
  for(float i = 0.; i < repeats; i++) {
    vec2 q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i, uv.x + uv.y)) + blurAmount);
    vec2 uv2 = uv + (q * blurAmount * gradient);

    blurredImage += draw(image, uv2) / 2.;
    q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i + 2., uv.x + uv.y + 24.)) + blurAmount);
    uv2 = uv + (q * blurAmount * gradient);

    blurredImage += draw(image, uv2) / 2.;
  }

  return blurredImage / repeats;
}

void main() {
  vec2 ratio = vec2(min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0), min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0));
  vec2 coord = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);

  float t = uTime + 123.0;
  float ta = t * 0.654321;
  float tb = t * (ta * 0.123456);
  vec4 noise = vec4(1. - tvNoise(coord, ta, tb)); // 이미지 노이즈 효과

  vec4 final = vec4(blur(coord, tMap, 0.08), 1.);

  final = final - noise * 0.2;

  gl_FragColor = final;
}`,ie=z({__name:"Blur",setup(I){const _=U(),{scrollY:b}=V(_),f=v(null),p=v(null),n=v([]),s=v({width:0,height:0});let o,g,r;const L=()=>{if(!f.value||!p.value)return;const e=new D,t=p.value.querySelectorAll(".media"),a={width:window.innerWidth,height:window.innerHeight};o=new F({canvas:f.value,alpha:!0,antialias:!0}),o.setPixelRatio(window.devicePixelRatio),o.setSize(a.width,a.height),o.setClearColor(0,0),g=new G,r=new H(45,a.width/a.height,.1,1e3),r.position.set(0,0,20),t.forEach(i=>{const c=i.querySelector("img"),l=i.getBoundingClientRect().top,d=M(i,c);n.value.push({el:i,mesh:d,initY:l}),e.add(d)}),g.add(e)},M=(e,t)=>{if(!t)return;const a=new Y;a.generateMipmaps=!1;const i=r.fov*(Math.PI/180),c=2*Math.tan(i/2)*r.position.z,l=c*r.aspect;s.value={width:l,height:c};const d=new N(1,1,50,100),y=new j({depthWrite:!1,depthTest:!1,uniforms:{tMap:{value:a},uPlaneSize:{value:new m},uImageSize:{value:new m},uViewportSize:{value:new m(s.value.width,s.value.height)},uTime:{value:0}},transparent:!0,vertexShader:ae,fragmentShader:te}),u=new Image;u.src=t.src,u.onload=()=>{a.image=u,y.uniforms.uImageSize.value.set(u.naturalWidth,u.naturalHeight),a.needsUpdate=!0};const x=new X(d,y);return P(x,e),x},P=(e,t,a,i)=>{a=a||t.offsetWidth,i=i||t.offsetHeight,e.scale.x=s.value.width*a/window.innerWidth,e.scale.y=s.value.height*i/window.innerHeight,e.material.uniforms.uPlaneSize.value=new m(e.scale.x,e.scale.y)},h=()=>{n.value.length&&n.value.forEach(({mesh:e,initY:t})=>{const a=s.value.height/2-e.scale.y/2-(t-b.value)/window.innerHeight*s.value.height;e.position.y=a})},w=()=>{const e={width:window.innerWidth,height:window.innerHeight};o.setSize(e.width,e.height),r.aspect=e.width/e.height,r.updateProjectionMatrix();const t=r.fov*(Math.PI/180),a=2*Math.tan(t/2)*r.position.z,i=a*r.aspect;s.value={width:i,height:a},n.value.length&&n.value.forEach(({el:c,mesh:l})=>{l.position.x=-(s.value.width/2)+l.scale.x/2+(c.offsetLeft+15)/e.width*s.value.width})},S=()=>{o.render(g,r),n.value.forEach(({mesh:e})=>{e.material.uniforms.uTime.value+=.04}),requestAnimationFrame(S)};return W(()=>{E(()=>{L(),S(),h(),w(),window.addEventListener("resize",w),window.addEventListener("scroll",h)})}),T(()=>{window.removeEventListener("resize",w),window.removeEventListener("scroll",h)}),(e,t)=>(R(),k("div",{ref_key:"blurWrapRef",ref:p,class:C(["blur"])},[A("canvas",{ref_key:"blurRef",ref:f},null,512),t[0]||(t[0]=B('<div class="sticky-wrap" data-v-494449ce><article class="inner-1" data-v-494449ce><div class="media-container" data-v-494449ce><figure class="media" data-v-494449ce><img src="'+Q+'" alt="fashion" data-v-494449ce></figure><small data-v-494449ce>(01)</small></div></article><article class="inner-2" data-v-494449ce><div class="media-container" data-v-494449ce><figure class="media" data-v-494449ce><img src="'+Z+'" alt="silueta" data-v-494449ce></figure><small data-v-494449ce>(02)</small></div><div class="media-container" data-v-494449ce><figure class="media" data-v-494449ce><img src="'+$+'" alt="spheres" data-v-494449ce></figure><small data-v-494449ce>(04)</small></div><div class="media-container" data-v-494449ce><figure class="media" data-v-494449ce><img src="'+J+'" alt="spheres" data-v-494449ce></figure><small data-v-494449ce>(04)</small></div></article><article class="inner-3" data-v-494449ce><div class="media-container" data-v-494449ce><figure class="media" data-v-494449ce><img src="'+K+'" alt="diana" data-v-494449ce></figure><small data-v-494449ce>(05)</small></div><div class="media-container" data-v-494449ce><figure class="media" data-v-494449ce><img src="'+ee+'" alt="abuelo" data-v-494449ce></figure><small data-v-494449ce>(06)</small></div></article></div>',1))],512))}}),re=O(ie,[["__scopeId","data-v-494449ce"]]),ce=z({__name:"Blur",setup(I){return(_,b)=>(R(),q(re))}});export{ce as default};
