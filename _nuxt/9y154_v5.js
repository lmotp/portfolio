import O from"./BnGjAVuK.js";import{m as J,B as K,A as Q,K as Z,r as d,J as j,n as ee,q as te,s as ie,c as S,a as s,b as H,w as se,T as ae,x as a,t as y,F as re,H as ne,y as oe,E as le,u as T,o as _,L as ce,G as de,_ as he}from"./FTP1zxOV.js";import{T as me,d as ue,V as k,M as ve,P as pe,b as ge,W as fe,S as we}from"./D1v7FCyw.js";import{u as M}from"./BHYF_7bM.js";const Se=""+new URL("6.DkRzaik8.webp",import.meta.url).href,ye=""+new URL("1.DO8A11Ar.webp",import.meta.url).href,_e=""+new URL("2.rLZpYlb9.webp",import.meta.url).href,be=""+new URL("3.DnR6LxEX.webp",import.meta.url).href,xe=""+new URL("4.aO_MQVsC.webp",import.meta.url).href,ze=""+new URL("5.BjFEcPVy.webp",import.meta.url).href,Re=`precision highp float;
#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Le=`precision highp float;
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
}`;class Te{constructor({geometry:e,scene:t,renderer:n,screen:l,viewport:h,$el:p,img:m}){this.renderer=n,this.geometry=e,this.scene=t,this.screen=l,this.viewport=h,this.img=m,this.$el=p,this.scroll=0,this.blurStrength=1,this.createShader(),this.createMesh(),this.onResize()}createShader(){const t=new me().load(this.img.src,n=>{this.material.uniforms.uImageSize.value.set(n.image.naturalWidth,n.image.naturalHeight)});t.generateMipmaps=!1,this.material=new ue({depthTest:!1,depthWrite:!1,vertexShader:Re,fragmentShader:Le,uniforms:{tMap:{value:t},uPlaneSize:{value:new k(0,0)},uImageSize:{value:new k(0,0)},uViewportSize:{value:new k(this.viewport.width,this.viewport.height)},uTime:{value:100*Math.random()},uBlurStrength:{value:this.blurStrength}},transparent:!0})}createMesh(){this.mesh=new ve(this.geometry,this.material),this.scene.add(this.mesh)}onScroll(e){this.scroll=e,this.setY(this.y)}update(){this.material.uniforms.uTime.value+=.04,this.material.uniforms.uBlurStrength.value=this.blurStrength}setScale(e,t){e=e||this.$el.offsetWidth,t=t||this.$el.offsetHeight,this.mesh.scale.x=this.viewport.width*e/this.screen.width,this.mesh.scale.y=this.viewport.height*t/this.screen.height,this.material.uniforms.uPlaneSize.value.set(this.mesh.scale.x,this.mesh.scale.y)}setX(e=0){this.x=e,this.mesh.position.x=-(this.viewport.width/2)+this.mesh.scale.x/2+this.x/this.screen.width*this.viewport.width}setY(e=0){this.y=e,this.mesh.position.y=this.viewport.height/2-this.mesh.scale.y/2-(this.y-this.scroll)/this.screen.height*this.viewport.height}onResize({screen:e,viewport:t}={}){e&&(this.screen=e),t&&(this.viewport=t,this.material.uniforms.uViewportSize.value.set(this.viewport.width,this.viewport.height)),this.setScale(),this.setX(this.$el.offsetLeft),this.setY(this.$el.offsetTop)}}class ke{constructor(e,t,n,l){this.images=[...l.querySelectorAll(".media")],this.isDisposed=n,this.renderer=e,this.scene=t,this.createCamera(),this.onResize(),this.createGeometry(),this.createMedias(),this.update(),this.addEventListeners()}createCamera(){this.camera=new pe(45,window.innerWidth/window.innerHeight,.1,100),this.camera.position.z=20}createGeometry(){this.planeGeometry=new ge(1,1,100,50)}createMedias(){this.medias=this.images.map(e=>new Te({renderer:this.renderer,geometry:this.planeGeometry,scene:this.scene,screen:this.screen,viewport:this.viewport,$el:e,img:e.querySelector("img")}))}onResize(){this.screen={width:window.innerWidth,height:window.innerHeight},this.renderer.setSize(this.screen.width,this.screen.height),this.camera.aspect=this.screen.width/this.screen.height,this.camera.updateProjectionMatrix();const e=this.camera.fov*(Math.PI/180),t=2*Math.tan(e/2)*this.camera.position.z,n=t*this.camera.aspect;this.viewport={height:t,width:n},this.medias&&(this.medias.forEach(l=>l.onResize({screen:this.screen,viewport:this.viewport})),this.onScroll({scroll:window.scrollY}))}easeInOut(e){return e<.5?2*e*e:-1+(4-2*e)*e}onScroll({scroll:e}){this.medias&&(this.medias.forEach(t=>t.onScroll(e)),this.checkHeroProgress(e))}checkHeroProgress(e){const t=this.easeInOut(Math.min(e/(this.screen.height*.57),1));let n=this.medias[0].$el.offsetHeight;const l=1+.05*t;this.medias[0].setScale(null,n*l),this.medias[0].blurStrength=1-.8*(1-t)}update(){this.isDisposed||!this.renderer||(this.medias&&this.medias.forEach(e=>e.update()),this.renderer.render(this.scene,this.camera),this.animationId=window.requestAnimationFrame(this.update.bind(this)))}addEventListeners(){window.addEventListener("resize",this.onResize.bind(this))}}const Me=["id"],Ie={class:"article-top"},Pe={class:"main-picture-wrap"},Ce={key:0,class:"init-wrap"},Ae=["src","alt"],We=["src","alt"],$e=["datetime"],He={class:"info-wrap"},Ve={class:"bottom-picture-wrap"},Ee=["src","alt"],De=J({__name:"index",props:{config:{},nextConfig:{}},setup(v){const{id:e,title:t,desc:n,date:l,stack:h,src:p}=v.config,{nextTitle:m,nextSrc:V}=v.nextConfig,E=K(),{scrollTrigger:D,lenisRef:g}=Q(E),U=Z();let u,b,x,I;const P=d(!1),C=d(!1),G=d(window.innerWidth===0?null:window.innerWidth<=768),z=d(null),R=d(null),L=d(null),f=d(null),A=d(window.innerHeight/2),q=j(()=>[{name:"Nuxt",src:"simple-icons:nuxtdotjs"},{name:"SCSS",src:"simple-icons:sass"},{name:"Chart",src:"simple-icons:chartdotjs"},{name:"Storybook",src:"simple-icons:storybook"},{name:"Express",src:"simple-icons:express"}].map(i=>({...i,isActive:h==null?void 0:h.includes(i.name)}))),F=()=>{L.value&&(A.value=window.innerHeight-L.value.offsetHeight),C.value=!0,N(),Y()},N=()=>{T.timeline({scrollTrigger:{trigger:".article-top",start:"top top",end:"bottom top",scrub:!0}}).fromTo(".article-top .picture",{transform:" scale(1)"},{transform:"translateY(10%) scale(1)"})},Y=()=>{var r;if(!z.value||!R.value)return;u=new fe({canvas:z.value,alpha:!0,antialias:!0}),u.setPixelRatio(Math.min(window.devicePixelRatio,2)),b=new we;const i=new ke(u,b,P.value,R.value);x=i.animationId,I=i.onResize,(r=g.value)==null||r.on("scroll",o=>{i.onScroll(o)})},B=()=>{var c,w;if(!f.value)return;g.value.stop();const i=T.timeline({id:`work-${e}`,onComplete:()=>{var W,$;(W=i.scrollTrigger)==null||W.kill(),i.kill(),($=T.getById(`work-${e}`))==null||$.kill();const X=m.toLowerCase();U.push(`/works/${X}`)}}),r=(c=f.value)==null?void 0:c.querySelector(".bottom-picture-wrap"),o=(w=f.value)==null?void 0:w.querySelector("h3");i.to(r,{translateY:`${window.innerHeight*-.5}px`,height:`${window.innerHeight}px`},0),i.to(o,{opacity:0},0)};return ee(async()=>{setTimeout(()=>{g.value.start()},1e3),window.scrollTo(0,0),g.value.scrollTo(0,{immediate:!0}),await te(F),D.value.refresh()}),ie(()=>{P.value=!0,x&&cancelAnimationFrame(x),b.traverse(i=>{if(i.isMesh&&(i.geometry&&i.geometry.dispose(),i.material)){const r=Array.isArray(i.material)?i.material:[i.material];for(const o of r)Object.keys(o).forEach(c=>{o[c]&&o[c].isTexture&&o[c].dispose()}),o.dispose()}}),window.removeEventListener("resize",I),u.renderLists.dispose(),u.dispose()}),(i,r)=>{const o=O;return _(),S("div",{ref_key:"blurWrapRef",ref:R,class:"detail-wrap",style:le({"--pictureWrapHeight":`${a(A)}px`})},[s("canvas",{ref_key:"blurRef",ref:z,id:"gl"},null,512),s("article",{id:`work-${a(e)}`},[s("div",Ie,[s("div",Pe,[r[0]||(r[0]=s("div",{class:"picture-bg"},null,-1)),H(ae,{name:"init"},{default:se(()=>[a(C)?ce("",!0):(_(),S("div",Ce,[s("img",{src:a(M)(a(p)),alt:a(t)},null,8,Ae)]))]),_:1}),s("img",{class:"picture",src:a(M)(a(p)),alt:a(t)},null,8,We)]),s("div",{ref_key:"titleWrapRef",ref:L,class:"title-wrap"},[s("h2",null,y(a(t)),1),s("ul",null,[(_(!0),S(re,null,ne(a(q),(c,w)=>(_(),S("li",{key:`stack-${w}`},[H(o,{name:c.src,size:a(G)?30:40,class:de(["icon",c.isActive&&"active"])},null,8,["name","size","class"])]))),128))]),s("time",{datetime:a(l)},y(a(l)),9,$e)],512)]),s("div",He,[s("p",null,y(a(n)),1),r[1]||(r[1]=oe('<div class="sticky-wrap" data-v-064d6451><article class="inner-1" data-v-064d6451><div class="media-container" data-v-064d6451><figure class="media" data-v-064d6451><img src="'+Se+'" alt="fashion" data-v-064d6451></figure><small data-v-064d6451>(01)</small></div></article><article class="inner-2" data-v-064d6451><div class="media-container" data-v-064d6451><figure class="media" data-v-064d6451><img src="'+ye+'" alt="silueta" data-v-064d6451></figure><small data-v-064d6451>(02)</small></div><div class="media-container" data-v-064d6451><figure class="media" data-v-064d6451><img src="'+_e+'" alt="spheres" data-v-064d6451></figure><small data-v-064d6451>(04)</small></div><div class="media-container" data-v-064d6451><figure class="media" data-v-064d6451><img src="'+be+'" alt="spheres" data-v-064d6451></figure><small data-v-064d6451>(04)</small></div></article><article class="inner-3" data-v-064d6451><div class="media-container" data-v-064d6451><figure class="media" data-v-064d6451><img src="'+xe+'" alt="diana" data-v-064d6451></figure><small data-v-064d6451>(05)</small></div><div class="media-container" data-v-064d6451><figure class="media" data-v-064d6451><img src="'+ze+'" alt="abuelo" data-v-064d6451></figure><small data-v-064d6451>(06)</small></div></article></div>',1))])],8,Me),s("article",{ref_key:"bottomRef",ref:f,class:"bottom-section",role:"button","data-detail":!0,onClick:B},[r[3]||(r[3]=s("strong",null,"NEXT",-1)),s("div",Ve,[r[2]||(r[2]=s("div",{class:"picture-bg"},null,-1)),s("img",{class:"picture",src:a(M)(a(V)),alt:a(m)},null,8,Ee),s("h3",null,y(a(m)),1)])],512)],4)}}}),Ne=he(De,[["__scopeId","data-v-064d6451"]]);export{Ne as _};
