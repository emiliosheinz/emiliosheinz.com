import React, { useRef } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
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
  onDragStart?: (info: {
    position: [number, number, number];
    face: "right" | "left" | "up" | "down" | "front" | "back";
    event: ThreeEvent<PointerEvent>;
  }) => void;
  onDrag?: (delta: { x: number; y: number }) => void;
  onDragEnd?: () => void;
};

function getFaceFromNormal(
  normal: THREE.Vector3,
): "right" | "left" | "up" | "down" | "front" | "back" {
  const n = normal.clone().normalize();

  if (Math.abs(n.x) > Math.abs(n.y) && Math.abs(n.x) > Math.abs(n.z)) {
    return n.x > 0 ? "right" : "left";
  } else if (Math.abs(n.y) > Math.abs(n.z)) {
    return n.y > 0 ? "up" : "down";
  } else {
    return n.z > 0 ? "front" : "back";
  }
}

export const Cubie = ({
  position,
  rightColor,
  leftColor,
  upColor,
  downColor,
  frontColor,
  backColor,
  onDragStart,
  onDrag,
  onDragEnd,
}: CubieProps) => {
  const textures = usePegatineTextures();
  const isDragging = useRef(false);
  const clickedFace = useRef<
    "right" | "left" | "up" | "down" | "front" | "back" | null
  >(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (onDragStart && event.face) {
      const face = getFaceFromNormal(event.face.normal);
      clickedFace.current = face;
      isDragging.current = true;
      dragStartPos.current = { x: event.clientX, y: event.clientY };

      (event.target as any).setPointerCapture(event.pointerId);

      onDragStart({ position, face, event });
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging.current && clickedFace.current && onDrag) {
      const deltaX = event.clientX - dragStartPos.current.x;
      const deltaY = event.clientY - dragStartPos.current.y;

      onDrag({ x: deltaX, y: deltaY });
    }
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging.current) {
      isDragging.current = false;
      clickedFace.current = null;

      (event.target as any).releasePointerCapture(event.pointerId);

      onDragEnd?.();
    }
  };

  function getMaterialProps(
    faceColor?: PegatineColor,
  ):
    | { color: string }
    | { map: THREE.Texture; metalness: number; roughness: number } {
    if (!faceColor) {
      return { color: "black" };
    }

    return {
      map: textures[faceColor] as THREE.Texture,
      metalness: 0.8,
      roughness: 0.2,
    };
  }

  return (
    <mesh
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
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
};

Cubie.displayName = "Cubie";
