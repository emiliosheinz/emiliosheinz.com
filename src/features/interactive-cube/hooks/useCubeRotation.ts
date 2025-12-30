/**
 * Hook for managing cube layer rotation state and snap animations.
 *
 * @module hooks/useCubeRotation
 */

import { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Axis, RotationState } from "../logic/rotation";
import type { Coord } from "../logic/coordinates";
import { useCube } from "./useCube";
import { Move } from "../logic/moves";

type SnapAnimation = {
  axis: Axis;
  layer: Coord;
  startAngle: number;
  targetAngle: number;
  startTime: number;
  duration: number;
  move: Move;
};

export type CubeRotationControls = {
  isAnimating: boolean;
  rotation: RotationState | null;
  rotate: (rotation: RotationState | null) => void;
  startSnapAnimation: (config: Omit<SnapAnimation, "startTime">) => void;
};

/**
 * Manages cube layer rotation state and smooth snap animations.
 */
export function useCubeRotation(): CubeRotationControls {
  const snapAnimationRef = useRef<SnapAnimation | null>(null);

  const rotation = useCube((state) => state.rotation);
  const rotate = useCube((state) => state.rotate);
  const commitMove = useCube((state) => state.commitMove);

  useFrame(() => {
    if (!snapAnimationRef.current) return;

    const now = performance.now();
    const elapsed = now - snapAnimationRef.current.startTime;
    const progress = Math.min(elapsed / snapAnimationRef.current.duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    const currentAngle =
      snapAnimationRef.current.startAngle +
      (snapAnimationRef.current.targetAngle -
        snapAnimationRef.current.startAngle) *
        eased;

    if (progress < 1) {
      rotate({
        sign: 1,
        axis: snapAnimationRef.current.axis,
        layer: snapAnimationRef.current.layer,
        angle: currentAngle,
      });
    } else {
      commitMove(snapAnimationRef.current.move);
      snapAnimationRef.current = null;
    }
  });

  const startSnapAnimation = useCallback(
    (config: Omit<SnapAnimation, "startTime">) => {
      snapAnimationRef.current = {
        ...config,
        startTime: performance.now(),
      };
    },
    [],
  );

  return {
    rotation,
    rotate,
    startSnapAnimation,
    isAnimating: snapAnimationRef.current !== null,
  };
}
