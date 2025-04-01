import * as THREE from "three";

type Lights = [THREE.AmbientLight, THREE.PointLight];

export const createLights = (): Lights => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);

  // Point light
  const pointLight = new THREE.PointLight(0xffffff, 200);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 4096;
  pointLight.shadow.mapSize.height = 4096;
  pointLight.shadow.camera.near = 1.5;
  pointLight.shadow.camera.far = 30;
  pointLight.shadow.radius = 16;

  return [ambientLight, pointLight];
};
