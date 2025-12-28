import React, { useRef } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { PegatineColor } from "./types";
import { usePegatineTextures } from "./usePegatineTexture";
import { FaceName } from "./cubeInteraction";

export type CubieProps = {
  position: [number, number, number];
  rightColor?: PegatineColor;
  leftColor?: PegatineColor;
  upColor?: PegatineColor;
  downColor?: PegatineColor;
  frontColor?: PegatineColor;
  backColor?: PegatineColor;
  isDragging?: boolean;
  onDragStart?: (info: {
    position: [number, number, number];
    face: FaceName;
    event: ThreeEvent<PointerEvent>;
    point: THREE.Vector3;
    normal: THREE.Vector3;
  }) => void;
  onDrag?: (delta: { x: number; y: number; point?: THREE.Vector3 }) => void;
  onDragEnd?: () => void;
};

function getFaceFromNormal(normal: THREE.Vector3): FaceName {
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
  const clickedFace = useRef<FaceName | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (onDragStart && event.face) {
      // The face normal from the raycast is in world space (already transformed by cube rotation)
      // But we need the CUBE-LOCAL normal to determine which cube face was clicked
      // We can derive this from the cubie's position and which face of the box was hit
      
      // Get the local face normal (which face of the cube: +X, -X, +Y, -Y, +Z, -Z)
      const faceNormal = event.face.normal.clone();
      
      // Determine face from the normal direction in the cubie's local space
      // The cubie mesh normal is in its own local space (not affected by cube rotation yet)
      const face = getFaceFromNormal(faceNormal);
      
      clickedFace.current = face;
      isDragging.current = true;
      dragStartPos.current = { x: event.clientX, y: event.clientY };

      (event.target as any).setPointerCapture(event.pointerId);

      // Now we need to provide the cube-local normal based on the cubie position and face
      // Each cubie face corresponds to a cube face direction
      let cubeFaceNormal = new THREE.Vector3();
      
      if (face === "right") cubeFaceNormal.set(1, 0, 0);
      else if (face === "left") cubeFaceNormal.set(-1, 0, 0);
      else if (face === "up") cubeFaceNormal.set(0, 1, 0);
      else if (face === "down") cubeFaceNormal.set(0, -1, 0);
      else if (face === "front") cubeFaceNormal.set(0, 0, 1);
      else if (face === "back") cubeFaceNormal.set(0, 0, -1);

      onDragStart({ 
        position, 
        face, 
        event,
        point: event.point,
        normal: cubeFaceNormal, // Pass cube-local normal, not world-transformed
      });
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging.current && clickedFace.current && onDrag) {
      const deltaX = event.clientX - dragStartPos.current.x;
      const deltaY = event.clientY - dragStartPos.current.y;

      // Update drag start position for next move event (incremental deltas, not cumulative)
      dragStartPos.current = { x: event.clientX, y: event.clientY };

      // Pass both screen delta and the current 3D point
      onDrag({ 
        x: deltaX, 
        y: deltaY,
        point: event.point,
      });
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
