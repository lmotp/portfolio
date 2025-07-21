import * as THREE from "three";

export default function (gl: HTMLElement, image: THREE.Texture) {
  // crop image like a "background: cover"
  const aspectOfScene = gl.clientWidth / gl.clientHeight;
  const aspectOfImage1 = image.image.width / image.image.height;

  const repeat = new THREE.Vector2();
  const offset = new THREE.Vector2();

  if (aspectOfScene / aspectOfImage1 > 1) {
    repeat.set(1.0, aspectOfImage1 / aspectOfScene);
  } else {
    repeat.set(aspectOfScene / aspectOfImage1, 1.0);
  }

  offset.set((1 - repeat.x) / 2, (1 - repeat.y) / 2);

  return { offset, repeat };
}
