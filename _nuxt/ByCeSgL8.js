import{e as y,r as E,p as D,q as W,v as F,c as X,o as A,m as j,s as q,g as $}from"./D4ANIz5k.js";import{aC as J,aE as K,at as Z,aF as Y,aG as ee,aH as te,aI as ae,aJ as re,aK as ie,aL as ne,f as N,ay as oe,a as P,N as c,aB as C,w as se,d as le,V as de,W as he,O as pe,S as ue,T as ge,M as S,b as ce,aM as T,aN as me,l as fe,m as ve,$ as Me,h as I,_ as _e,B as Se,C as Te,k as Ee}from"./BD8dNJ6u.js";import{O as xe}from"./DhYVZotJ.js";import{P as G,F as O,E as we,R as Re}from"./D7-TXODE.js";import{u as b}from"./Cz3nu93G.js";import{u as Ne}from"./aJe_C5tR.js";import{s as Pe}from"./DfDmfrbP.js";const Ce={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Ie extends G{constructor(){super();const t=Ce;this.uniforms=J.clone(t.uniforms),this.material=new K({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new O(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,n,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Z.getTransfer(this._outputColorSpace)===Y&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ee?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===te?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ae?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===re?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ie?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ne&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class be extends G{constructor(t,n,a,r={}){super(),this.pixelSize=t,this.resolution=new N,this.renderResolution=new N,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new oe,this.fsQuad=new O(this.pixelatedMaterial),this.scene=n,this.camera=a,this.normalEdgeStrength=r.normalEdgeStrength||.3,this.depthEdgeStrength=r.depthEdgeStrength||.4,this.beautyRenderTarget=new P,this.beautyRenderTarget.texture.minFilter=c,this.beautyRenderTarget.texture.magFilter=c,this.beautyRenderTarget.texture.type=C,this.beautyRenderTarget.depthTexture=new se,this.normalRenderTarget=new P,this.normalRenderTarget.texture.minFilter=c,this.normalRenderTarget.texture.magFilter=c,this.normalRenderTarget.texture.type=C}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(t,n){this.resolution.set(t,n),this.renderResolution.set(t/this.pixelSize|0,n/this.pixelSize|0);const{x:a,y:r}=this.renderResolution;this.beautyRenderTarget.setSize(a,r),this.normalRenderTarget.setSize(a,r),this.fsQuad.material.uniforms.resolution.value.set(a,r,1/a,1/r)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,n){const a=this.fsQuad.material.uniforms;a.normalEdgeStrength.value=this.normalEdgeStrength,a.depthEdgeStrength.value=this.depthEdgeStrength,t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera);const r=this.scene.overrideMaterial;t.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=r,a.tDiffuse.value=this.beautyRenderTarget.texture,a.tDepth.value=this.beautyRenderTarget.depthTexture,a.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(n),this.clear&&t.clear()),this.fsQuad.render(t)}createPixelatedMaterial(){return new le({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new de(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D tDiffuse;
				uniform sampler2D tDepth;
				uniform sampler2D tNormal;
				uniform vec4 resolution;
				uniform float normalEdgeStrength;
				uniform float depthEdgeStrength;
				varying vec2 vUv;

				float getDepth(int x, int y) {

					return texture2D( tDepth, vUv + vec2(x, y) * resolution.zw ).r;

				}

				vec3 getNormal(int x, int y) {

					return texture2D( tNormal, vUv + vec2(x, y) * resolution.zw ).rgb * 2.0 - 1.0;

				}

				float depthEdgeIndicator(float depth, vec3 normal) {

					float diff = 0.0;
					diff += clamp(getDepth(1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(-1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, 1) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, -1) - depth, 0.0, 1.0);
					return floor(smoothstep(0.01, 0.02, diff) * 2.) / 2.;

				}

				float neighborNormalEdgeIndicator(int x, int y, float depth, vec3 normal) {

					float depthDiff = getDepth(x, y) - depth;
					vec3 neighborNormal = getNormal(x, y);

					// Edge pixels should yield to faces who's normals are closer to the bias normal.
					vec3 normalEdgeBias = vec3(1., 1., 1.); // This should probably be a parameter.
					float normalDiff = dot(normal - neighborNormal, normalEdgeBias);
					float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);

					// Only the shallower pixel should detect the normal edge.
					float depthIndicator = clamp(sign(depthDiff * .25 + .0025), 0.0, 1.0);

					return (1.0 - dot(normal, neighborNormal)) * depthIndicator * normalIndicator;

				}

				float normalEdgeIndicator(float depth, vec3 normal) {

					float indicator = 0.0;

					indicator += neighborNormalEdgeIndicator(0, -1, depth, normal);
					indicator += neighborNormalEdgeIndicator(0, 1, depth, normal);
					indicator += neighborNormalEdgeIndicator(-1, 0, depth, normal);
					indicator += neighborNormalEdgeIndicator(1, 0, depth, normal);

					return step(0.1, indicator);

				}

				void main() {

					vec4 texel = texture2D( tDiffuse, vUv );

					float depth = 0.0;
					vec3 normal = vec3(0.0);

					if (depthEdgeStrength > 0.0 || normalEdgeStrength > 0.0) {

						depth = getDepth(0, 0);
						normal = getNormal(0, 0);

					}

					float dei = 0.0;
					if (depthEdgeStrength > 0.0)
						dei = depthEdgeIndicator(depth, normal);

					float nei = 0.0;
					if (normalEdgeStrength > 0.0)
						nei = normalEdgeIndicator(depth, normal);

					float Strength = dei > 0.0 ? (1.0 - depthEdgeStrength * dei) : (1.0 + normalEdgeStrength * nei);

					gl_FragColor = texel * Strength;

				}
			`})}}const ye=y({__name:"Pixel",setup(v){const t=E(null),n=E(null),a=new Te;let r,o,p,u,M,f,_,l;const U=()=>{if(!t.value)return;r=new he({canvas:t.value,alpha:!0}),r.setClearColor("#151729"),r.setSize(window.innerWidth,window.innerHeight),r.shadowMap.enabled=!0;const e=window.innerWidth/window.innerHeight;p=new pe(-e,e,1,-1,.1,10),p.position.set(0,2*Math.tan(Math.PI/6),2),_=new xe(p,r.domElement),_.enablePan=!1,_.enableZoom=!1,o=new ue,L(),B(),k(),R()},L=()=>{const e=new ge;M=x(e.load(b("/images/experiments/processing/checker.png"))),f=x(e.load(b("/images/experiments/processing/checker.png"))),M.repeat.set(3,3),f.repeat.set(1.5,1.5),w(.4,0,0,Math.PI/4,f),w(.5,-.5,-.5,Math.PI/4,f);const i=new S(new ce(2,2),new T({map:M}));i.receiveShadow=!0,i.rotation.x=-Math.PI/2,o.add(i);const s=.2,d=new me(s);u=new S(d,new T({color:6862825,emissive:5209739,shininess:10,specular:16777215})),u.receiveShadow=!0,u.castShadow=!0,o.add(u)},B=()=>{o.add(new fe(7700366,3));const e=new ve(16776909,1.5);e.position.set(100,100,100),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),o.add(e);const i=new Me(16761088,10,10,Math.PI/16,.02,2);i.position.set(2,2,0),i.castShadow=!0,o.add(i);const s=i.target;s.position.set(0,0,0),o.add(s)},k=()=>{l=new we(r);const e=new Re(o,p);l.addPass(e);const i=new be(6,o,p);l.addPass(i);const s=new Ie;l.addPass(s)},x=e=>(e.minFilter=c,e.magFilter=c,e.generateMipmaps=!1,e.wrapS=I,e.wrapT=I,e.colorSpace=_e,e),w=(e,i,s,d,g)=>{const m=new Se(e,e,e),V=new T({map:g}),h=new S(m,V);return h.castShadow=!0,h.receiveShadow=!0,h.rotation.y=d,h.position.y=e/2,h.position.set(i,e/2+1e-4,s),o.add(h),h};function z(e){return e**2*3-e**3*2}function Q(e,i,s){const g=1/(s-i),m=-g*i;return Ee.clamp(m+g*e,0,1)}function H(e,i,s){const d=e/s|0,g=e-d*s,m=z(Q(g,i,s));return d+m}const R=()=>{n.value=requestAnimationFrame(R);const e=a.getElapsedTime();u.position.y=.7+Math.sin(e*2)*.05,u.rotation.y=H(e,2,4)*2*Math.PI,l.render()};return D(()=>{W(U)}),F(()=>{n.value&&cancelAnimationFrame(n.value),o&&Ne(o),l&&(l.passes.forEach(e=>{e.dispose&&e.dispose()}),l.dispose()),r.renderLists.dispose(),r.dispose()}),(e,i)=>(A(),X("canvas",{ref_key:"pixelRef",ref:t},null,512))}}),Be=y({__name:"Pixel",setup(v){const t=j(),{downloadPercent:n}=q(t),a=E(null),r=()=>{a.value=Pe(()=>{const o=Math.floor(Math.random()*5)+1;n.value+o>=100?(n.value=100,a.value&&clearInterval(a.value)):n.value+=o},25)};return D(()=>{r()}),F(()=>{a.value&&clearInterval(a.value)}),(o,p)=>(A(),$(ye))}});export{Be as default};
