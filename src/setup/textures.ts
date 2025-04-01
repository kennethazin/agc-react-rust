import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export const loadTexture = (path: string) => {
  return textureLoader.load(path);
};
