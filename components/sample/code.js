///////// 모델 로딩 받는 코드 ////////////////////////////////////////////

// const manager = new THREE.LoadingManager();
// const loader = new GLTFLoader(manager);

// manager.onProgress = (url, loaded, total) => {
//   // console.log(`${(loaded / total) * 100}% 로드됨`);
// };
// manager.onLoad = () => {
//   // console.log("모든 모델 로드 완료");
// };

///////// OrbitControls ////////////////////////////////////////////
// controls = new OrbitControls(camera, renderer.domElement);
// controls.minPolarAngle = 0; (카메라 회전 최소치)
// controls.maxPolarAngle = Math.PI * 0.5; (카메라 회전 최대치)
// controls.minDistance = 1; (카메라 줌 최소치)
// controls.maxDistance = 10; (카메라 줌 최대치)

///////// 모델 로드하는 코드 ////////////////////////////////////////////
function loadModel(loader, path, position) {
  loader.load(
    path,
    function (gltf) {
      const model = gltf.scene; // Use gltf.scene instead of gltf
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();

      box.getCenter(center);
      model.position.sub(center);
      model.position.y -= box.min.y / 2;

      if (position === "bottom") {
        model.position.x += box.min.x + 15;
      }

      scene.add(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

///////// 카메라가 전체화면으로 받을 수 있게끔. ////////////////////////////////////////////
// https://stackoverflow.com/questions/63872740/three-js-scaling-a-plane-to-full-screen
function getXFOV() {
  // Convert angle to radiant
  const FOV = camera.fov;
  let yFovRadiant = (FOV * Math.PI) / 180;
  // Calculate X-FOV Radiant
  let xFovRadiant = 2 * Math.atan(Math.tan(yFovRadiant / 2) * (window.innerWidth / window.innerHeight));
  // Convert back to angle
  let xFovAngle = (xFovRadiant * 180) / Math.PI;
  return xFovAngle;
}

// bgMaterial = new THREE.ShaderMaterial({
//   vertexShader: bgVertexShader,
//   fragmentShader: bgFragmentShader,
//   uniforms: {
//     uTime: { value: 0 },
//     uMouse: { value: new THREE.Vector2() },
//     uTexture: { value: new THREE.TextureLoader().load(bg1) },
//     uNoise: { value: new THREE.TextureLoader().load(noise2) },
//     uProgress: { value: new THREE.Vector2(settings.progressX, settings.progressY) },
//     uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
//   },
// });

// bgMaterial.uniforms.uTime.value = time;
// bgMaterial.uniforms.uProgress.value = new THREE.Vector2(settings.progressX, settings.progressY);
// bgMaterial.uniforms.uMouse.value = mouse;

highlightGeometry = new THREE.PlaneGeometry(1, 1);
highlightMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  transparent: true,
});
highlightPlane = new THREE.Mesh(highlightGeometry, highlightMaterial);
highlightPlane.position.set(0.5, 0, 0.5);

sphereGeometry = new THREE.SphereGeometry(0.4, 4, 2);
sphereMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xffea00,
});
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// matter-wrap 플러그인을 사용하여 래핑
circle.plugin.wrap = {
  min: { x: render.bounds.min.x, y: render.bounds.min.y },
  max: { x: render.bounds.max.x, y: render.bounds.max.y },
};

// Add SVG wave

// SVG path to vertices converter
const pathToVertices = (path, segments) => {
  const pathLength = path.getTotalLength();
  const vertices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = path.getPointAtLength(t * pathLength);
    vertices.push({ x: point.x, y: point.y });
  }

  return vertices;
};

const loadSvg = async (url) => {
  return fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((raw) => {
      return new window.DOMParser().parseFromString(raw, "image/svg+xml");
    });
};

const select = function (root, selector) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
};

const wave = await loadSvg("/images/physics/wave.svg").then(function (root) {
  const y = 550;
  const paths = select(root, "path");
  const vertexSets = paths.map((path) => pathToVertices(path, 30));
  const options = {
    isStatic: true,
    render: {
      fillStyle: "#060a19",
      strokeStyle: "#060a19",
      lineWidth: 1,
    },
  };

  return Bodies.fromVertices(centerX, y, vertexSets, options, true);
});
