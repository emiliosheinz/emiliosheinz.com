import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { PegatineTextures } from "./types";

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
