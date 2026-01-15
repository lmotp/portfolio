import{aC as L,aE as k,at as z,aF as Q,aG as H,aH as V,aI as W,aJ as X,aK as j,aL as $,f as E,ay as q,a as x,N as g,aB as w,w as J,d as K,V as Z,W as Y,O as ee,S as te,T as ae,M as v,b as re,aM as M,aN as ie,l as ne,m as oe,$ as se,h as R,_ as le,B as de,C as he,k as pe}from"./BD8dNJ6u.js";import{O as ge}from"./DhYVZotJ.js";import{P,F as C,E as ce,R as ue}from"./D7-TXODE.js";import{e as b,r as me,l as fe,n as ve,c as Me,o as y,i as N,g as _e}from"./t8Z0vWH_.js";const Se={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Te extends P{constructor(){super();const e=Se;this.uniforms=L.clone(e.uniforms),this.material=new k({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new C(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,o,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},z.getTransfer(this._outputColorSpace)===Q&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===H?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===V?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===W?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===X?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===j?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Ee extends P{constructor(e,o,a,r={}){super(),this.pixelSize=e,this.resolution=new E,this.renderResolution=new E,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new q,this.fsQuad=new C(this.pixelatedMaterial),this.scene=o,this.camera=a,this.normalEdgeStrength=r.normalEdgeStrength||.3,this.depthEdgeStrength=r.depthEdgeStrength||.4,this.beautyRenderTarget=new x,this.beautyRenderTarget.texture.minFilter=g,this.beautyRenderTarget.texture.magFilter=g,this.beautyRenderTarget.texture.type=w,this.beautyRenderTarget.depthTexture=new J,this.normalRenderTarget=new x,this.normalRenderTarget.texture.minFilter=g,this.normalRenderTarget.texture.magFilter=g,this.normalRenderTarget.texture.type=w}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(e,o){this.resolution.set(e,o),this.renderResolution.set(e/this.pixelSize|0,o/this.pixelSize|0);const{x:a,y:r}=this.renderResolution;this.beautyRenderTarget.setSize(a,r),this.normalRenderTarget.setSize(a,r),this.fsQuad.material.uniforms.resolution.value.set(a,r,1/a,1/r)}setPixelSize(e){this.pixelSize=e,this.setSize(this.resolution.x,this.resolution.y)}render(e,o){const a=this.fsQuad.material.uniforms;a.normalEdgeStrength.value=this.normalEdgeStrength,a.depthEdgeStrength.value=this.depthEdgeStrength,e.setRenderTarget(this.beautyRenderTarget),e.render(this.scene,this.camera);const r=this.scene.overrideMaterial;e.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,e.render(this.scene,this.camera),this.scene.overrideMaterial=r,a.tDiffuse.value=this.beautyRenderTarget.texture,a.tDepth.value=this.beautyRenderTarget.depthTexture,a.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(o),this.clear&&e.clear()),this.fsQuad.render(e)}createPixelatedMaterial(){return new K({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new Z(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
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
			`})}}const xe=b({__name:"Pixel",setup(m){const e=me(null),o=new he;let a,r,c,p,f,u;const I=()=>{if(!e.value)return;a=new Y({canvas:e.value,alpha:!0}),a.setClearColor("#151729"),a.setSize(window.innerWidth,window.innerHeight),a.shadowMap.enabled=!0;const t=window.innerWidth/window.innerHeight;c=new ee(-t,t,1,-1,.1,10),c.position.set(0,2*Math.tan(Math.PI/6),2),f=new ge(c,a.domElement),f.enablePan=!1,f.enableZoom=!1,r=new te,D(),F(),A(),T()},D=()=>{const t=new ae,i=_(t.load(N("/images/experiments/processing/checker.png"))),n=_(t.load(N("/images/experiments/processing/checker.png")));i.repeat.set(3,3),n.repeat.set(1.5,1.5),S(.4,0,0,Math.PI/4,n),S(.5,-.5,-.5,Math.PI/4,n);const s=new v(new re(2,2),new M({map:i}));s.receiveShadow=!0,s.rotation.x=-Math.PI/2,r.add(s);const l=.2,d=new ie(l);p=new v(d,new M({color:6862825,emissive:5209739,shininess:10,specular:16777215})),p.receiveShadow=!0,p.castShadow=!0,r.add(p)},F=()=>{r.add(new ne(7700366,3));const t=new oe(16776909,1.5);t.position.set(100,100,100),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),r.add(t);const i=new se(16761088,10,10,Math.PI/16,.02,2);i.position.set(2,2,0),i.castShadow=!0,r.add(i);const n=i.target;n.position.set(0,0,0),r.add(n)},A=()=>{u=new ce(a);const t=new ue(r,c);u.addPass(t);const i=new Ee(6,r,c);u.addPass(i);const n=new Te;u.addPass(n)},_=t=>(t.minFilter=g,t.magFilter=g,t.generateMipmaps=!1,t.wrapS=R,t.wrapT=R,t.colorSpace=le,t),S=(t,i,n,s,l)=>{const d=new de(t,t,t),B=new M({map:l}),h=new v(d,B);return h.castShadow=!0,h.receiveShadow=!0,h.rotation.y=s,h.position.y=t/2,h.position.set(i,t/2+1e-4,n),r.add(h),h};function G(t){return t**2*3-t**3*2}function O(t,i,n){const l=1/(n-i),d=-l*i;return pe.clamp(d+l*t,0,1)}function U(t,i,n){const s=t/n|0,l=t-s*n,d=G(O(l,i,n));return s+d}const T=()=>{requestAnimationFrame(T);const t=o.getElapsedTime();p.position.y=.7+Math.sin(t*2)*.05,p.rotation.y=U(t,2,4)*2*Math.PI,u.render()};return fe(()=>{ve(I)}),(t,i)=>(y(),Me("canvas",{ref_key:"pixelRef",ref:e},null,512))}}),Ce=b({__name:"Pixel",setup(m){return(e,o)=>(y(),_e(xe))}});export{Ce as default};
