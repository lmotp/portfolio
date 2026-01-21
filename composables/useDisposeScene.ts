import * as THREE from "three";

export default (scene: THREE.Scene) => {
  if (!scene) return;

  scene.traverse((object: any) => {
    // 1. Geometry 해제 (모든 타입의 객체 대응)
    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.isLight && object.shadow && object.shadow.map) {
      object.shadow.map.dispose(); // 섀도우 맵 렌더 타겟 해제
      object.shadow.map = null; // 참조 제거
    }

    // 2. Material 해제
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat: any) => cleanMaterial(mat));
      } else {
        cleanMaterial(object.material);
      }
    }
  });
};

const cleanMaterial = (material: any) => {
  // 1. 재질에 연결된 모든 표준 텍스처 맵 해제
  // GLTF 모델 등에서 사용하는 텍스처들은 이 리스트에 포함되어 있습니다.
  const textureKeys = [
    "map",
    "lightMap",
    "bumpMap",
    "normalMap",
    "specularMap",
    "gradientMap",
    "emissiveMap",
    "metalnessMap",
    "roughnessMap",
    "envMap",
    "displacementMap",
    "alphaMap",
    "aoMap",
  ];

  textureKeys.forEach((key) => {
    // .isTexture 체크가 instanceof보다 더 안정적입니다.
    if (material[key] && material[key].isTexture) {
      material[key].dispose();
    }
  });

  // 2. ShaderMaterial uniforms 내부의 텍스처 해제
  if (material.uniforms) {
    for (const key in material.uniforms) {
      const uniform = material.uniforms[key];
      if (uniform && uniform.value && uniform.value.isTexture) {
        uniform.value.dispose();
      }
    }
  }

  // 3. 재질 자체 해제
  material.dispose();
};
