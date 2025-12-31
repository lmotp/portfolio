import{aC as L,aE as k,at as Q,aF as H,aG as V,aH as W,aI as X,aJ as j,aK as q,aL as $,V as w,ay as J,a as R,N as m,aB as N,w as K,d as Z,e as Y,W as ee,O as te,S as ae,T as re,M as _,b as ie,aM as S,aN as ne,l as oe,m as se,$ as le,h as P,_ as de,B as he,C as pe,k as ge}from"./D1v7FCyw.js";import{G as ce}from"./hsJpI9MV.js";import{O as me}from"./D9M70cXg.js";import{P as C,F as y,E as ue,R as fe}from"./CPel3THH.js";import{m as I,r as ve,n as Me,q as _e,c as Se,o as b,p as xe}from"./Dm_YJzf9.js";const Te={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Ee extends C{constructor(){super();const e=Te;this.uniforms=L.clone(e.uniforms),this.material=new k({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new y(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,o,r){this.uniforms.tDiffuse.value=r.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Q.getTransfer(this._outputColorSpace)===H&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===V?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===W?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===X?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===j?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===q?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class we extends C{constructor(e,o,r,n={}){super(),this.pixelSize=e,this.resolution=new w,this.renderResolution=new w,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new J,this.fsQuad=new y(this.pixelatedMaterial),this.scene=o,this.camera=r,this.normalEdgeStrength=n.normalEdgeStrength||.3,this.depthEdgeStrength=n.depthEdgeStrength||.4,this.beautyRenderTarget=new R,this.beautyRenderTarget.texture.minFilter=m,this.beautyRenderTarget.texture.magFilter=m,this.beautyRenderTarget.texture.type=N,this.beautyRenderTarget.depthTexture=new K,this.normalRenderTarget=new R,this.normalRenderTarget.texture.minFilter=m,this.normalRenderTarget.texture.magFilter=m,this.normalRenderTarget.texture.type=N}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(e,o){this.resolution.set(e,o),this.renderResolution.set(e/this.pixelSize|0,o/this.pixelSize|0);const{x:r,y:n}=this.renderResolution;this.beautyRenderTarget.setSize(r,n),this.normalRenderTarget.setSize(r,n),this.fsQuad.material.uniforms.resolution.value.set(r,n,1/r,1/n)}setPixelSize(e){this.pixelSize=e,this.setSize(this.resolution.x,this.resolution.y)}render(e,o){const r=this.fsQuad.material.uniforms;r.normalEdgeStrength.value=this.normalEdgeStrength,r.depthEdgeStrength.value=this.depthEdgeStrength,e.setRenderTarget(this.beautyRenderTarget),e.render(this.scene,this.camera);const n=this.scene.overrideMaterial;e.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,e.render(this.scene,this.camera),this.scene.overrideMaterial=n,r.tDiffuse.value=this.beautyRenderTarget.texture,r.tDepth.value=this.beautyRenderTarget.depthTexture,r.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(o),this.clear&&e.clear()),this.fsQuad.render(e)}createPixelatedMaterial(){return new Z({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new Y(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
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
			`})}}const Re=I({__name:"Pixel",setup(v){const e=ve(null),o=new pe,r=new ce,n={pixelSize:6};let g,s,u,c,M,f;const D=()=>{if(!e.value)return;g=new ee({canvas:e.value,alpha:!0}),g.setClearColor("#151729"),g.setSize(window.innerWidth,window.innerHeight),g.shadowMap.enabled=!0;const t=window.innerWidth/window.innerHeight;u=new te(-t,t,1,-1,.1,10),u.position.set(0,2*Math.tan(Math.PI/6),2),M=new me(u,g.domElement),M.enablePan=!1,M.enableZoom=!1,s=new ae,F(),A(),G(),E()},F=()=>{const t=new re,a=x(t.load("/images/experiments/processing/checker.png")),i=x(t.load("/images/experiments/processing/checker.png"));a.repeat.set(3,3),i.repeat.set(1.5,1.5),T(.4,0,0,Math.PI/4,i),T(.5,-.5,-.5,Math.PI/4,i);const l=new _(new ie(2,2),new S({map:a}));l.receiveShadow=!0,l.rotation.x=-Math.PI/2,s.add(l);const d=.2,h=new ne(d);c=new _(h,new S({color:6862825,emissive:5209739,shininess:10,specular:16777215})),c.receiveShadow=!0,c.castShadow=!0,s.add(c)},A=()=>{s.add(new oe(7700366,3));const t=new se(16776909,1.5);t.position.set(100,100,100),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),s.add(t);const a=new le(16761088,10,10,Math.PI/16,.02,2);a.position.set(2,2,0),a.castShadow=!0,s.add(a);const i=a.target;i.position.set(0,0,0),s.add(i)},G=()=>{f=new ue(g);const t=new fe(s,u);f.addPass(t);const a=new we(6,s,u);f.addPass(a),r.add(n,"pixelSize").min(1).max(16).step(1).onChange(()=>{a.setPixelSize(n.pixelSize)});const i=new Ee;f.addPass(i)},x=t=>(t.minFilter=m,t.magFilter=m,t.generateMipmaps=!1,t.wrapS=P,t.wrapT=P,t.colorSpace=de,t),T=(t,a,i,l,d)=>{const h=new he(t,t,t),B=new S({map:d}),p=new _(h,B);return p.castShadow=!0,p.receiveShadow=!0,p.rotation.y=l,p.position.y=t/2,p.position.set(a,t/2+1e-4,i),s.add(p),p};function O(t){return t**2*3-t**3*2}function z(t,a,i){const d=1/(i-a),h=-d*a;return ge.clamp(h+d*t,0,1)}function U(t,a,i){const l=t/i|0,d=t-l*i,h=O(z(d,a,i));return l+h}const E=()=>{requestAnimationFrame(E);const t=o.getElapsedTime();c.position.y=.7+Math.sin(t*2)*.05,c.rotation.y=U(t,2,4)*2*Math.PI,f.render()};return Me(()=>{_e(D)}),(t,a)=>(b(),Se("canvas",{ref_key:"pixelRef",ref:e},null,512))}}),be=I({__name:"Pixel",setup(v){return(e,o)=>(b(),xe(Re))}});export{be as default};
