import React from "react";
import * as THREE from "three";
import { PegatineColor } from "./types";
import { usePegatineTextures } from "./usePegatineTexture";

export type CubieProps = {
  position: [number, number, number];
  rightColor?: PegatineColor;
  leftColor?: PegatineColor;
  upColor?: PegatineColor;
  downColor?: PegatineColor;
  frontColor?: PegatineColor;
  backColor?: PegatineColor;
};

export const Cubie = React.forwardRef<THREE.Mesh, CubieProps>(
  (
    {
      position,
      rightColor,
      leftColor,
      upColor,
      downColor,
      frontColor,
      backColor,
    },
    ref,
  ) => {
    const textures = usePegatineTextures();

    function getMaterialProps(
      faceColor?: PegatineColor,
    ): { color: string } | { map: THREE.Texture; metalness: number } {
      if (!faceColor) {
        return { color: "black" };
      }

      return { map: textures[faceColor] as THREE.Texture, metalness: 0.3 };
    }

    return (
      <mesh ref={ref} position={position}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial
          attach="material-0"
          {...getMaterialProps(rightColor)}
        />
        <meshStandardMaterial
          attach="material-1"
          {...getMaterialProps(leftColor)}
        />
        <meshStandardMaterial
          attach="material-2"
          {...getMaterialProps(upColor)}
        />
        <meshStandardMaterial
          attach="material-3"
          {...getMaterialProps(downColor)}
        />
        <meshStandardMaterial
          attach="material-4"
          {...getMaterialProps(frontColor)}
        />
        <meshStandardMaterial
          attach="material-5"
          {...getMaterialProps(backColor)}
        />
      </mesh>
    );
  },
);

Cubie.displayName = "Cubie";
