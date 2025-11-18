import{V as w,g as f,S as z,O as G,h as C,a as F,b as P,M as E,W as I,w as g}from"./Dmytbkr3.js";import{G as O}from"./hsJpI9MV.js";import{u as W}from"./C7vw3ofb.js";import{m as S,r as H,n as U,p as k,o as b,c as B,a as V,y as A}from"./Dc6rEite.js";import{O as Y}from"./BT9n5m5z.js";import{_ as j}from"./DlAUqK2U.js";const N=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,q=`precision highp float;
#define GLSLIFY 1

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uThreshold;
uniform float uRadius;

varying vec2 vUv;

float circle(vec2 uv, vec2 pos, vec2 res, float r) {
    vec2 dist = uv - pos;
    dist.y *= res.x / res.y;
    return 1.0 - smoothstep(r - (r * 0.01), r + (r * 0.01), dot(dist, dist));
}

float getLuminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
    vec2 st = vUv;
    vec2 texelSize = 1.0 / uResolution;

    // ... (Sobel Edge Detection 부분은 동일) ...
    float L_ul = getLuminance(texture2D(uTexture, st + vec2(-texelSize.x, texelSize.y)).rgb);
    float L_up = getLuminance(texture2D(uTexture, st + vec2(0.0, texelSize.y)).rgb);
    float L_ur = getLuminance(texture2D(uTexture, st + vec2(texelSize.x, texelSize.y)).rgb);

    float L_left = getLuminance(texture2D(uTexture, st + vec2(-texelSize.x, 0.0)).rgb);
    float L_right = getLuminance(texture2D(uTexture, st + vec2(texelSize.x, 0.0)).rgb);

    float L_dl = getLuminance(texture2D(uTexture, st + vec2(-texelSize.x, -texelSize.y)).rgb);
    float L_down = getLuminance(texture2D(uTexture, st + vec2(0.0, -texelSize.y)).rgb);
    float L_dr = getLuminance(texture2D(uTexture, st + vec2(texelSize.x, -texelSize.y)).rgb);

    float Gx = (L_ul + 2.0 * L_left + L_dl) - (L_ur + 2.0 * L_right + L_dr);
    float Gy = (L_ul + 2.0 * L_up + L_ur) - (L_dl + 2.0 * L_down + L_dr);

    float edgeStrength = abs(Gx) + abs(Gy);
    float line = smoothstep(uThreshold - 0.05, uThreshold + 0.05, edgeStrength);
    vec3 lineColor = vec3(1.0 - line);

    vec3 textureColor = texture2D(uTexture, st).rgb;

    float ring = circle(st, uMouse, uResolution, uRadius);
    vec3 finalColor = mix(textureColor, lineColor, ring);

    gl_FragColor = vec4(finalColor, 1.0);
}`,X=S({__name:"Map",setup(T){const s=H(null),u=new f,c=new w(.5,.5),h=new O,a={threshold:.5,radius:.01};let p,r,_,n,i,d,t;const y=()=>{if(!s.value)return;const e=window.innerWidth,o=window.innerHeight;d=new z,i=new G(-e/2,e/2,o/2,-o/2,1,1e3),i.position.set(0,0,100),new C().load(W("/images/experiments/map/cover.jpg"),m=>{const v=m.image.naturalWidth,x=m.image.naturalHeight;p=new F(v,x,32,32),r=new P({uniforms:{uTime:{value:0},uTexture:{value:m},uMouse:{value:c},uRadius:{value:.01},uResolution:{value:new w(e,o)},uThreshold:{value:a.threshold}},vertexShader:N,fragmentShader:q}),_=new E(p,r),d.add(_);const l=10,D=new f((-v+e)/2+l,(-x+o)/2+l,-1/0),R=new f((v-e)/2-l,(x-o)/2-l,1/0);t.addEventListener("change",()=>{u.copy(t.target),t.target.clamp(D,R),u.sub(t.target),i.position.sub(u)})}),n=new I({canvas:s.value,antialias:!0,alpha:!0}),n.setPixelRatio(window.devicePixelRatio),n.setSize(e,o),t=new Y(i,n.domElement),t.enableZoom=!1,t.enableRotate=!1,t.enableDamping=!0,t.dampingFactor=.05,t.mouseButtons={LEFT:g.PAN,MIDDLE:g.DOLLY,RIGHT:g.PAN},h.add(a,"threshold",0,1,.01),h.add(a,"radius",0,1,.01)},M=e=>{c.x=e.clientX/window.innerWidth,c.y=1-e.clientY/window.innerHeight},L=e=>{requestAnimationFrame(L),t.update(),r&&e&&(r.uniforms.uThreshold.value=a.threshold,r.uniforms.uTime.value=e*.05,r.uniforms.uRadius.value=a.radius),n.render(d,i)};return U(()=>{k(()=>{y(),L()})}),(e,o)=>(b(),B("div",{class:"about",onMousemove:M},[V("canvas",{ref_key:"aboutRef",ref:s},null,512)],32))}}),Z=j(X,[["__scopeId","data-v-46af830b"]]),re=S({__name:"Map",setup(T){return(s,u)=>(b(),A(Z))}});export{re as default};
