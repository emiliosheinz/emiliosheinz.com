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

export type FaceName = "U" | "D" | "L" | "R" | "F" | "B" | "M" | "E" | "S";

export type SliceName = "M" | "S" | "E";
