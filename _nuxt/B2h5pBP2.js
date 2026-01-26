import{e as U,r as _,p as F,v as V,c as Z,o as I,m as Y,s as O,g as $}from"./D4ANIz5k.js";import{g as M,W as j,w as J,a as k,d as L,P as K,S as Q,e as X,v as w,M as S,b as ee,G as D,x as te,l as oe,m as ae,f as ie,C as ne}from"./BD8dNJ6u.js";import{D as re,G as le}from"./By_ixScT.js";import{E as se,R as ce,S as ve}from"./D7-TXODE.js";import{u as de}from"./Cz3nu93G.js";import{u as ge}from"./aJe_C5tR.js";import{s as me}from"./DfDmfrbP.js";const pe=`#define GLSLIFY 1
#include <packing>
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform sampler2D tNormal;
uniform float cameraNear;
uniform float cameraFar;
uniform vec2 resolution;

const mat3 Sx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);
const mat3 Sy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);

  return fract((p3.x + p3.y) * p3.z);
}

float readDepth(sampler2D depthTexture, vec2 coord) {
  float fragCoordZ = texture2D(depthTexture, coord).x;
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

float luma(vec3 color) {
  const vec3 magic = vec3(0.2125, 0.7154, 0.0721);
  return dot(magic, color);
}

void main() {
  vec2 uv = vUv;
  vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);

  float outlineThickness = 1.5;
  vec4 outlineColor = vec4(0.0, 0.0, 0.0, 1.0);

  vec2 displacement = vec2((hash(gl_FragCoord.xy) * sin(gl_FragCoord.y * 0.05)), (hash(gl_FragCoord.xy) * cos(gl_FragCoord.x * 0.05))) * 2.0 / resolution.xy;

  float depth = readDepth(tDepth, vUv);
  vec4 normal = texture2D(tNormal, vUv);
  vec4 pixelColor = texture2D(tDiffuse, vUv);

  float depth00 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, 1));
  float depth01 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, 0));
  float depth02 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, -1));

  float depth10 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, -1));
  float depth11 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, 0));
  float depth12 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, 1));

  float depth20 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, -1));
  float depth21 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, 0));
  float depth22 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, 1));

  float xSobelValueDepth = Sx[0][0] * depth00 + Sx[1][0] * depth01 + Sx[2][0] * depth02 +
    Sx[0][1] * depth10 + Sx[1][1] * depth11 + Sx[2][1] * depth12 +
    Sx[0][2] * depth20 + Sx[1][2] * depth21 + Sx[2][2] * depth22;

  float ySobelValueDepth = Sy[0][0] * depth00 + Sy[1][0] * depth01 + Sy[2][0] * depth02 +
    Sy[0][1] * depth10 + Sy[1][1] * depth11 + Sy[2][1] * depth12 +
    Sy[0][2] * depth20 + Sy[1][2] * depth21 + Sy[2][2] * depth22;

  float gradientDepth = sqrt(pow(xSobelValueDepth, 2.0) + pow(ySobelValueDepth, 2.0));

  float normal00 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, -1)).rgb);
  float normal01 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, 0)).rgb);
  float normal02 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, 1)).rgb);

  float normal10 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, -1)).rgb);
  float normal11 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, 0)).rgb);
  float normal12 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, 1)).rgb);

  float normal20 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, -1)).rgb);
  float normal21 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, 0)).rgb);
  float normal22 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, 1)).rgb);

  float xSobelNormal = Sx[0][0] * normal00 + Sx[1][0] * normal10 + Sx[2][0] * normal20 +
    Sx[0][1] * normal01 + Sx[1][1] * normal11 + Sx[2][1] * normal21 +
    Sx[0][2] * normal02 + Sx[1][2] * normal12 + Sx[2][2] * normal22;

  float ySobelNormal = Sy[0][0] * normal00 + Sy[1][0] * normal10 + Sy[2][0] * normal20 +
    Sy[0][1] * normal01 + Sy[1][1] * normal11 + Sy[2][1] * normal21 +
    Sy[0][2] * normal02 + Sy[1][2] * normal12 + Sy[2][2] * normal22;

  float gradientNormal = sqrt(pow(xSobelNormal, 2.0) + pow(ySobelNormal, 2.0));
  float outline = gradientDepth * 25.0 + gradientNormal;

  float diffuseLight = normal.a;
  float pixelLuma = luma(pixelColor.rgb + diffuseLight * 0.65);
  float modVal = 11.0;

  if(pixelLuma <= 0.35 && depth <= 0.99) {
    if(mod((vUv.y + displacement.y) * resolution.y, modVal) < outlineThickness) {
      pixelColor = outlineColor;
    };
  }
  if(pixelLuma <= 0.55 && depth <= 0.99) {
    if(mod((vUv.x + displacement.x) * resolution.x, modVal) < outlineThickness) {
      pixelColor = outlineColor;
    };
  }
  if(pixelLuma <= 0.80 && depth <= 0.99) {
    if(mod((vUv.x + displacement.x) * resolution.y + (vUv.y + displacement.y) * resolution.x, modVal) <= outlineThickness) {
      pixelColor = outlineColor;
    };
  }

  if(normal.r >= 1.0 && normal.g >= 1.0 && normal.b >= 1.0) {
    pixelColor = vec4(1.0, 1.0, 1.0, 1.0);
  }

  vec4 color = mix(pixelColor, outlineColor, outline);

  gl_FragColor = color;
}
`,ue=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,C=`#define GLSLIFY 1
varying vec3 vNormal;
varying vec3 eyeVector;
uniform vec3 lightPosition;

const float shininess = 600.0;
const float diffuseness = 0.5;

vec2 phong() {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(lightPosition);
  vec3 halfVector = normalize(eyeVector - lightDirection);

  float NdotL = dot(normal, lightDirection);
  float NdotH = dot(normal, halfVector);
  float NdotH2 = NdotH * NdotH;

  float kDiffuse = max(0.0, NdotL) * diffuseness;
  float kSpecular = pow(NdotH2, shininess);

  return vec2(kSpecular, kDiffuse);
}

void main() {
  vec3 color = vec3(vNormal);
  vec2 phongLighting = phong();

  float specularLight = phongLighting.x;
  float diffuseLight = phongLighting.y;

  if(specularLight >= 0.25) {
    color = vec3(1.0, 1.0, 1.0);
  }

  gl_FragColor = vec4(color, diffuseLight);
}
`,fe=`#define GLSLIFY 1
varying vec3 vNormal;
varying vec3 eyeVector;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);
  eyeVector = normalize(worldPos.xyz - cameraPosition);
}
`,xe=`#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 eyeVector;
uniform float uTime;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}

float displace(vec3 point) {
  return cnoise(point * 0.05 - vec3(0.0, uTime * 2.5, 0.0)) * 2.5;
}

void main() {
  vUv = uv;

  vec3 displacedPosition = position + normal * displace(position);
  vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  eyeVector = normalize(modelPosition.xyz - cameraPosition);

  float offset = 0.01;
  vec3 tangent = orthogonal(normal);
  vec3 bitangent = normalize(cross(normal, tangent));
  vec3 neighbour1 = position + tangent * offset;
  vec3 neighbour2 = position + bitangent * offset;
  vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
  vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);

  vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
  vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

  // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
  vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
  vNormal = displacedNormal * normalMatrix;
}
`,he=U({__name:"Moebius",setup(G){const u=_(null),c=_(null),i=new M(-50,50,15);let o,l,v,y,a,r,f,s,x,b,T,m,p,z;const h=new ne,R=()=>{u.value&&(o=new j({canvas:u.value}),o.setClearColor("#050505"),o.setSize(window.innerWidth,window.innerHeight),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.shadowMap.enabled=!0,l=new J(window.innerWidth,window.innerHeight),v=new k(window.innerWidth,window.innerHeight),v.depthBuffer=!0,v.depthTexture=l,y=new k(window.innerWidth,window.innerHeight),b=new L({uniforms:{lightPosition:{value:i}},vertexShader:fe,fragmentShader:C}),T=new L({uniforms:{uTime:{value:0},lightPosition:{value:i}},vertexShader:xe,fragmentShader:C}),r=new K(75,window.innerWidth/window.innerHeight,.01,800),r.position.set(-8,4,-20),r.lookAt(new M(0,0,0)),a=new Q,E(),H(),q(),B(),A(),N())},E=()=>{const t=new X(2,32,32),e=new w({color:"darkorange"}),n=new S(t,e);n.position.set(80,50,140),n.scale.set(10,10,10);const P=new w({color:"cyan"}),d=new S(t,P);d.position.set(50,55,120),d.scale.set(3,3,3),a.add(n),a.add(d)},H=()=>{const t=new ee(300,300,100,100);x=new w({color:"#FF6457"}),x.onBeforeCompile=e=>{e.uniforms.uTime={value:0},e.vertexShader=`uniform float uTime;
      vec4 permute(vec4 x) {
        return mod(((x*34.0)+1.0)*x, 289.0);
      }

      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      vec3 fade(vec3 t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
      }

      float cnoise(vec3 P) {
        vec3 Pi0 = floor(P); // Integer part for indexing
        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
        return 2.2 * n_xyz;
      }

      vec3 orthogonal(vec3 v) {
        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        : vec3(0.0, -v.z, v.y));
      }


      float displace(vec3 point) {
        return cnoise(point * 0.05 - vec3(0.0, uTime * 2.5, 0.0)) * 2.5;
      }
    `+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <clipping_planes_vertex>",`#include <clipping_planes_vertex>


        vec3 displacedPosition = position + normal * displace(position);
        vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        float offset = 0.01;
        vec3 tangent = orthogonal(normal);
        vec3 bitangent = normalize(cross(normal, tangent));
        vec3 neighbour1 = position + tangent * offset;
        vec3 neighbour2 = position + bitangent * offset;
        vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
        vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);

        vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
        vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

        // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
        vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
        vNormal = displacedNormal;`),x.userData.shader=e},s=new S(t,x),s.name="ground",s.receiveShadow=!0,s.castShadow=!0,s.rotation.x=-Math.PI/2,s.position.y=-1,a.add(s)},q=async()=>{const t=new D;t.rotation.set(0,Math.PI/2,0),t.position.set(0,2,0);const e=new D;e.scale.set(.005,.005,.005),e.rotation.set(0,-Math.PI*.5,0),e.position.set(1.583,0,-3.725),m=new D,z=new re,z.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");const n=new le;n.setDRACOLoader(z),n.load(de("/models/spaceship-optimized.glb"),async P=>{const d=P.scene;d.children.forEach(g=>{g.receiveShadow=!0,g.castShadow=!0,g.scale.set(1,1,1),g.name==="Cube001_spaceship_racer_0"?g.position.set(739.26,-64.81,64.77):g.position.set(739.26,0,0),W(g.material)}),await o.compileAsync(d,r,a),e.add(d),m.add(e),t.add(m),a.add(t)})},W=t=>{t.transparent=!0,t.alphaToCoverage=!0,t.depthFunc=te,t.depthTest=!0,t.depthWrite=!0},B=()=>{const t=new oe(16777215,2);f=new ae(16777215,5),f.castShadow=!0,f.position.set(i.x,i.y,i.z),f.target=s,a.add(t),a.add(f)},A=()=>{p=new se(o);const t=Math.min(window.devicePixelRatio,2),e=new ce(a,r),n=new ve({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},cameraNear:{value:0},cameraFar:{value:0},resolution:{value:new ie}},fragmentShader:pe,vertexShader:ue});n.uniforms.cameraNear.value=r.near,n.uniforms.cameraFar.value=r.far,n.uniforms.tDepth.value=v.depthTexture,n.uniforms.tNormal.value=y.texture,n.uniforms.resolution.value.set(window.innerWidth*t,window.innerHeight*t),p.addPass(e),p.addPass(n)},N=()=>{c.value=requestAnimationFrame(N),o.setRenderTarget(v),o.render(a,r);const t=[];o.setRenderTarget(y),a.traverse(e=>{e.isMesh&&(t.push(e.material),e.name==="ground"?(x.userData.shader.uniforms.uTime.value=h.getElapsedTime(),e.material=T,e.material.uniforms.uTime.value=h.getElapsedTime(),e.material.uniforms.lightPosition.value=i):(e.material=b,e.material.uniforms.lightPosition.value=i))}),o.render(a,r),a.traverse(e=>{e.isMesh&&(e.material=t.shift())}),o.setRenderTarget(null),p.render(),m&&(m.rotation.x=Math.cos(h.getElapsedTime()*2)*Math.cos(h.getElapsedTime())*.15,m.position.y=Math.sin(h.getElapsedTime()*2)+1)};return F(()=>{R()}),V(()=>{c.value&&cancelAnimationFrame(c.value),a&&ge(a),[v,y].forEach(e=>{e&&(e.texture.dispose(),e.dispose())}),l&&l.dispose(),p&&p.dispose(),o.shadowMap.enabled=!1,o.renderLists.dispose(),o.dispose()}),(t,e)=>(I(),Z("canvas",{ref_key:"MoebiusRef",ref:u},null,512))}}),be=U({__name:"Moebius",setup(G){const u=Y(),{downloadPercent:c}=O(u),i=_(null),o=()=>{i.value=me(()=>{const l=Math.floor(Math.random()*5)+1;c.value+l>=100?(c.value=100,i.value&&clearInterval(i.value)):c.value+=l},25)};return F(()=>{o()}),V(()=>{i.value&&clearInterval(i.value)}),(l,v)=>(I(),$(he))}});export{be as default};
