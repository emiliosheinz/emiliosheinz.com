/**
 * Individual cube piece (cubie) component with drag interaction.
 *
 * @module components/Cubie
 */

import type { ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  type PegatineColor,
  usePegatineTextures,
} from "../hooks/use-pegatine-textures";
import { type FaceName, getFaceFromLocalNormal } from "../logic/rotation";

type CubieProps = {
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
    normal: THREE.Vector3;
  }) => void;
  onDrag?: (pointer: { x: number; y: number }) => void;
  onDragEnd?: () => void;
};

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
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!onDragStart || !event.face) return;

    event.stopPropagation();
    const face = getFaceFromLocalNormal(event.face.normal);

    isDragging.current = true;
    dragStartPos.current = { x: event.clientX, y: event.clientY };

    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    onDragStart({ position, face, event, normal: FACE_NORMALS[face] });
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current || !onDrag) return;

    onDrag({ x: event.clientX, y: event.clientY });
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;

    isDragging.current = false;

    (event.target as HTMLElement).releasePointerCapture(event.pointerId);

    onDragEnd?.();
  };

  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 8, 0.1), []);

  const renderMaterial = (key: number, faceColor?: PegatineColor) => {
    return (
      <meshStandardMaterial
        metalness={0.8}
        roughness={0.2}
        attach={`material-${key}`}
        {...(faceColor ? { map: textures[faceColor] } : { color: "black" })}
      />
    );
  };

  return (
    <mesh
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <primitive object={geometry} />
      {renderMaterial(0, rightColor)}
      {renderMaterial(1, leftColor)}
      {renderMaterial(2, upColor)}
      {renderMaterial(3, downColor)}
      {renderMaterial(4, frontColor)}
      {renderMaterial(5, backColor)}
    </mesh>
  );
};

