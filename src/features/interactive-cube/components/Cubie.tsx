/**
 * Individual cube piece (cubie) component with drag interaction.
 * 
 * @module components/Cubie
 */

import React, { useRef } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { usePegatineTextures, PegatineColor } from "../hooks/usePegatineTextures";
import { FaceName, getFaceFromLocalNormal } from "../logic/rotation";

export interface CubieProps {
  position: [number, number, number];
  rightColor?: PegatineColor;
  leftColor?: PegatineColor;
  upColor?: PegatineColor;
  downColor?: PegatineColor;
  frontColor?: PegatineColor;
  backColor?: PegatineColor;
  onDragStart?: (info: {
    position: [number, number, number];
    face: FaceName;
    event: ThreeEvent<PointerEvent>;
    point: THREE.Vector3;
    normal: THREE.Vector3;
  }) => void;
  onDrag?: (delta: { x: number; y: number; point?: THREE.Vector3 }) => void;
  onDragEnd?: () => void;
}

const FACE_NORMALS: Record<FaceName, THREE.Vector3> = {
  right: new THREE.Vector3(1, 0, 0),
  left: new THREE.Vector3(-1, 0, 0),
  up: new THREE.Vector3(0, 1, 0),
  down: new THREE.Vector3(0, -1, 0),
  front: new THREE.Vector3(0, 0, 1),
  back: new THREE.Vector3(0, 0, -1),
};

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
      const face = getFaceFromLocalNormal(event.face.normal);
      
      clickedFace.current = face;
      isDragging.current = true;
      dragStartPos.current = { x: event.clientX, y: event.clientY };

      (event.target as any).setPointerCapture(event.pointerId);

      onDragStart({ 
        position, 
        face, 
        event,
        point: event.point,
        normal: FACE_NORMALS[face],
      });
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging.current && clickedFace.current && onDrag) {
      const deltaX = event.clientX - dragStartPos.current.x;
      const deltaY = event.clientY - dragStartPos.current.y;

      dragStartPos.current = { x: event.clientX, y: event.clientY };

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
      <meshStandardMaterial attach="material-0" {...getMaterialProps(rightColor)} />
      <meshStandardMaterial attach="material-1" {...getMaterialProps(leftColor)} />
      <meshStandardMaterial attach="material-2" {...getMaterialProps(upColor)} />
      <meshStandardMaterial attach="material-3" {...getMaterialProps(downColor)} />
      <meshStandardMaterial attach="material-4" {...getMaterialProps(frontColor)} />
      <meshStandardMaterial attach="material-5" {...getMaterialProps(backColor)} />
    </mesh>
  );
};

Cubie.displayName = "Cubie";
