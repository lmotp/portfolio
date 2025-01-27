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
