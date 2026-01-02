/**
 * Hook for loading cube sticker textures.
 *
 * @module hooks/usePegatineTextures
 */

import { useLoader } from "@react-three/fiber";
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

/**
 * Loads all cube sticker textures.
 */
export function usePegatineTextures(): PegatineTextures {
  const [red, orange, blue, green, white, yellow] = useLoader(
    THREE.TextureLoader,
    [
      "images/textures/red-pegatine.png",
      "images/textures/orange-pegatine.png",
      "images/textures/blue-pegatine.png",
      "images/textures/green-pegatine.png",
      "images/textures/white-pegatine.png",
      "images/textures/yellow-pegatine.png",
    ],
  );

  return { red, orange, blue, green, white, yellow };
}
