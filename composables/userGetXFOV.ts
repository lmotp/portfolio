import * as THREE from "three";

export default function (camera: THREE.PerspectiveCamera) {
  // Convert angle to radiant
  const FOV = camera.fov;
  let yFovRadiant = (FOV * Math.PI) / 180;
  // Calculate X-FOV Radiant
  let xFovRadiant = 2 * Math.atan(Math.tan(yFovRadiant / 2) * (window.innerWidth / window.innerHeight));
  // Convert back to angle
  let xFovAngle = (xFovRadiant * 180) / Math.PI;
  return xFovAngle;
}
