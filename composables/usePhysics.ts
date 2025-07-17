import * as CANNON from "cannon-es";
import * as THREE from "three";

export const usePhysics = () => {
  let world: CANNON.World;
  let sphereBody: CANNON.Body;
  let groundBody: CANNON.Body;

  const initPhysics = () => {
    // Initialize physics world
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Create sphere body
    const sphereShape = new CANNON.Sphere(0.3);
    sphereBody = new CANNON.Body({
      mass: 1,
      shape: sphereShape,
      position: new CANNON.Vec3(0, 0.4, 0),
      material: new CANNON.Material()
    });
    world.addBody(sphereBody);

    // Create ground body (line)
    const groundShape = new CANNON.Box(new CANNON.Vec3(5, 0.125, 0.5));
    groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      position: new CANNON.Vec3(0, 0, 0),
      material: new CANNON.Material()
    });
    groundBody.quaternion.setFromEuler(THREE.MathUtils.degToRad(-7), 0, 0);
    world.addBody(groundBody);
  };

  const updatePhysics = (sphere: THREE.Mesh) => {
    // Update physics world
    world.step(1/60);

    // Update sphere position from physics
    sphere.position.set(
      sphereBody.position.x,
      sphereBody.position.y,
      sphereBody.position.z
    );
    sphere.quaternion.set(
      sphereBody.quaternion.x,
      sphereBody.quaternion.y,
      sphereBody.quaternion.z,
      sphereBody.quaternion.w
    );
  };

  return {
    initPhysics,
    updatePhysics
  };
};
