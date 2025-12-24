import{g as N,W as q,w as W,a as T,d as M,P as B,S as A,f as Z,v as z,M as P,b as Y,G as w,x as O,l as $,m as j,V as J,C as K}from"./D1v7FCyw.js";import{G as Q}from"./hsJpI9MV.js";import{D as X,G as ee}from"./DqAXrD07.js";import{E as te,R as oe,S as ae}from"./CPel3THH.js";import{m as L,r as ie,n as ne,c as re,o as C,p as le}from"./FTP1zxOV.js";const ce=`#define GLSLIFY 1
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
`,se=`#define GLSLIFY 1
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,k=`#define GLSLIFY 1
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
`,ve=`#define GLSLIFY 1
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
`,de=`#define GLSLIFY 1
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
`,ge=L({__name:"Moebius",setup(U){const u=ie(null),r=new N(-50,50,15);let i,S,v,h,o,n,d,l,g,_,D,s,x;const m=new K;new Q;const F=()=>{u.value&&(i=new q({canvas:u.value}),i.setClearColor("#3386E0"),i.setSize(window.innerWidth,window.innerHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.shadowMap.enabled=!0,S=new W(window.innerWidth,window.innerHeight),v=new T(window.innerWidth,window.innerHeight),v.depthBuffer=!0,v.depthTexture=S,h=new T(window.innerWidth,window.innerHeight),_=new M({uniforms:{lightPosition:{value:r}},vertexShader:ve,fragmentShader:k}),D=new M({uniforms:{uTime:{value:0},lightPosition:{value:r}},vertexShader:de,fragmentShader:k}),n=new B(75,window.innerWidth/window.innerHeight,.01,800),n.position.set(-8,4,-20),n.lookAt(new N(0,0,0)),o=new A,V(),G(),I(),E(),H(),b())},V=()=>{const t=new Z(2,32,32),e=new z({color:"darkorange"}),a=new P(t,e);a.position.set(80,50,140),a.scale.set(10,10,10);const f=new z({color:"cyan"}),p=new P(t,f);p.position.set(50,55,120),p.scale.set(3,3,3),o.add(a),o.add(p)},G=()=>{const t=new Y(300,300,100,100);g=new z({color:"#FF6457"}),g.onBeforeCompile=e=>{e.uniforms.uTime={value:0},e.vertexShader=`uniform float uTime;
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
        vNormal = displacedNormal;`),g.userData.shader=e},l=new P(t,g),l.name="ground",l.receiveShadow=!0,l.castShadow=!0,l.rotation.x=-Math.PI/2,l.position.y=-1,o.add(l)},I=async()=>{const t=new w;t.rotation.set(0,Math.PI/2,0),t.position.set(0,2,0);const e=new w;e.scale.set(.005,.005,.005),e.rotation.set(0,-Math.PI*.5,0),e.position.set(1.583,0,-3.725),s=new w;const a=new X;a.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");const f=new ee;f.setDRACOLoader(a),f.load("/models/spaceship-optimized.glb",async p=>{const y=p.scene;y.children.forEach(c=>{c.receiveShadow=!0,c.castShadow=!0,c.scale.set(1,1,1),c.name==="Cube001_spaceship_racer_0"?c.position.set(739.26,-64.81,64.77):c.position.set(739.26,0,0),R(c.material)}),await i.compileAsync(y,n,o),e.add(y),s.add(e),t.add(s),o.add(t)})},R=t=>{t.transparent=!0,t.alphaToCoverage=!0,t.depthFunc=O,t.depthTest=!0,t.depthWrite=!0},E=()=>{const t=new $(16777215,2);d=new j(16777215,5),d.castShadow=!0,d.position.set(r.x,r.y,r.z),d.target=l,o.add(t),o.add(d)},H=()=>{x=new te(i);const t=Math.min(window.devicePixelRatio,2),e=new oe(o,n),a=new ae({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},cameraNear:{value:0},cameraFar:{value:0},resolution:{value:new J}},fragmentShader:ce,vertexShader:se});a.uniforms.cameraNear.value=n.near,a.uniforms.cameraFar.value=n.far,a.uniforms.tDepth.value=v.depthTexture,a.uniforms.tNormal.value=h.texture,a.uniforms.resolution.value.set(window.innerWidth*t,window.innerHeight*t),x.addPass(e),x.addPass(a)},b=()=>{requestAnimationFrame(b),i.setRenderTarget(v),i.render(o,n);const t=[];i.setRenderTarget(h),o.traverse(e=>{e.isMesh&&(t.push(e.material),e.name==="ground"?(g.userData.shader.uniforms.uTime.value=m.getElapsedTime(),e.material=D,e.material.uniforms.uTime.value=m.getElapsedTime(),e.material.uniforms.lightPosition.value=r):(e.material=_,e.material.uniforms.lightPosition.value=r))}),i.render(o,n),o.traverse(e=>{e.isMesh&&(e.material=t.shift())}),i.setRenderTarget(null),x.render(),s&&(s.rotation.x=Math.cos(m.getElapsedTime()*2)*Math.cos(m.getElapsedTime())*.15,s.position.y=Math.sin(m.getElapsedTime()*2)+1)};return ne(()=>{F()}),(t,e)=>(C(),re("canvas",{ref_key:"MoebiusRef",ref:u},null,512))}}),he=L({__name:"Moebius",setup(U){return(u,r)=>(C(),le(ge))}});export{he as default};
