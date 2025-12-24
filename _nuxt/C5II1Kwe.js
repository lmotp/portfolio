import{m as y,r as g,u as x,n as M,q as C,s as k,c as F,o as h,p as P}from"./FTP1zxOV.js";import{V as w,W as U,P as L,S as R,T,b as V,d as b,D as G,e as W,M as D,C as O,k as B,g as E}from"./D1v7FCyw.js";import{G as j}from"./hsJpI9MV.js";import{u as I}from"./BHYF_7bM.js";const q=`#define GLSLIFY 1
uniform float time;
uniform float progress;
uniform vec4 resolution;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vFrontShadow;

void main() {
  vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);

  gl_FragColor = texture2D(uTexture, newUV);
  gl_FragColor.rgb *= vFrontShadow;
}`,H=`#define GLSLIFY 1
uniform float time;
uniform float angle;
uniform float progress;

varying vec2 vUv;
varying float vFrontShadow;

const float pi = 3.14159265359;
const float rad = 0.1;
const float rolls = 8.;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;

  float finalAngle = angle - 0. * 0.3 * sin(progress * 6.);
  vec3 newposition = position;
  newposition = rotate(newposition - vec3(-.5, .5, 0.), vec3(0., 0., 1.), -finalAngle) + vec3(-.5, .5, 0.);

  float offs = (newposition.x + 0.5) / (sin(finalAngle) + cos(finalAngle)); // -0.5..0.5 -> 0..1
  float tProgress = clamp((progress - offs * 0.99) / 0.01, 0., 1.);

  // shadows
  vFrontShadow = clamp((progress - offs * 0.95) / 0.05, 0.7, 1.);

  newposition.z = rad + rad * (1. - offs / 2.) * sin(-offs * rolls * pi - 0.5 * pi);
  newposition.x = -0.5 + rad * (1. - offs / 2.) * cos(-offs * rolls * pi + 0.5 * pi);
  // // rot back
  newposition = rotate(newposition - vec3(-.5, .5, 0.), vec3(0., 0., 1.), finalAngle) + vec3(-.5, .5, 0.);
  // unroll
  newposition = rotate(newposition - vec3(-.5, 0.5, rad), vec3(sin(finalAngle), cos(finalAngle), 0.), -pi * progress * rolls);
  newposition += vec3(-.5 + progress * cos(finalAngle) * (sin(finalAngle) + cos(finalAngle)), 0.5 - progress * sin(finalAngle) * (sin(finalAngle) + cos(finalAngle)), rad * (1. - progress / 2.));

  // animation
  vec3 finalposition = mix(newposition, position, tProgress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalposition, 1.0);
}`,Y=y({__name:"Roll",setup(z){const t=new j,i=g({angle:.15,rollOpen:()=>{x.to(a.uniforms.progress,{duration:1.7,value:1,ease:"power2.inOut"})},rollClose:()=>{x.to(a.uniforms.progress,{duration:1.7,value:.1,ease:"power2.inOut"})}}),c=g(null),e=g(new w(window.innerWidth,window.innerHeight)),_=new O;let s,u,o,m,a,r;const A=()=>{c.value&&(s=new U({logarithmicDepthBuffer:!0,canvas:c.value}),s.setSize(e.value.x,e.value.y),s.setPixelRatio(window.devicePixelRatio),s.setClearColor(16777215,1),o=new L(70,e.value.x/e.value.y,300,1e3),o.position.set(0,0,400),o.lookAt(0,0,0),u=new R,new T().load(I("/images/experiments/roll/texture.jpg"),n=>{m=new V(1,1,80,80),a=new b({uniforms:{time:{value:0},progress:{value:.2},angle:{value:.15},resolution:{value:new W(n.image.width,n.image.height,1,1)},uTexture:{value:n}},transparent:!0,side:G,vertexShader:H,fragmentShader:q}),console.log(a),r=new D(m,a),u.add(r),t.add(i.value,"angle",0,1,.01),t.add(i.value,"rollOpen"),t.add(i.value,"rollClose"),x.to(a.uniforms.progress,{duration:1.7,value:1,ease:"power2.inOut"}),v()}))},d=()=>{requestAnimationFrame(d);const n=_.getElapsedTime();a&&(a.uniforms.time.value=n,a.uniforms.angle.value=i.value.angle),s.render(u,o)},v=()=>{e.value.set(window.innerWidth,window.innerHeight),o.aspect=e.value.x/e.value.y,o.updateProjectionMatrix(),s.setSize(e.value.x,e.value.y);const n=B.degToRad(o.fov),f=Math.abs((o.position.z-r.position.z)*Math.tan(n/2)*2),S=f*o.aspect,p=new w,l=new E;p.set(e.value.x>e.value.y?e.value.y*.5:e.value.x*.1,e.value.x>e.value.y?e.value.y*.5:e.value.y*.333),l.set(S*(e.value.x-p.x)/e.value.x,f*(e.value.y-p.y)/e.value.y,1),r.scale.set(l.x,l.y,l.z)};return M(()=>{C(()=>{A(),d(),window.addEventListener("resize",v)})}),k(()=>{s.dispose(),window.removeEventListener("resize",v)}),(n,f)=>(h(),F("canvas",{ref_key:"rollRef",ref:c},null,512))}}),Q=y({__name:"Roll",setup(z){return(t,i)=>(h(),P(Y))}});export{Q as default};
