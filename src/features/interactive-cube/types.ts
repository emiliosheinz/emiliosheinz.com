import * as THREE from "three";

export interface PegatineTextures {
  red: THREE.Texture;
  orange: THREE.Texture;
  blue: THREE.Texture;
  green: THREE.Texture;
  white: THREE.Texture;
  yellow: THREE.Texture;
}

export type PegatineColor = keyof PegatineTextures;


