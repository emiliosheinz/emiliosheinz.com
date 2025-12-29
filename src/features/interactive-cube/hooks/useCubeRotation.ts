/**
 * Hook for managing cube layer rotation state and snap animations.
 *
 * @module hooks/useCubeRotation
 */

import { useState, useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Axis } from "../logic/rotation";
import type { Coord } from "../logic/coordinates";

export interface RotationState {
  axis: Axis;
  layer: Coord;
  angle: number;
  sign: number;
}

interface SnapAnimation {
  axis: Axis;
  layer: Coord;
  startAngle: number;
  targetAngle: number;
  startTime: number;
  duration: number;
  onComplete: () => void;
}

export interface CubeRotationControls {
  rotationState: RotationState | null;
  setRotationState: (state: RotationState | null) => void;
  startSnapAnimation: (config: Omit<SnapAnimation, "startTime">) => void;
  isAnimating: boolean;
}

/**
 * Manages cube layer rotation state and smooth snap animations.
 */
export function useCubeRotation(): CubeRotationControls {
  const [rotationState, setRotationState] = useState<RotationState | null>(
    null,
  );
  const snapAnimationRef = useRef<SnapAnimation | null>(null);

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
      setRotationState({
        sign: 1,
        axis: snapAnimationRef.current.axis,
        layer: snapAnimationRef.current.layer,
        angle: currentAngle,
      });
    } else {
      snapAnimationRef.current.onComplete();
      snapAnimationRef.current = null;
      setRotationState(null);
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
    rotationState,
    setRotationState,
    startSnapAnimation,
    isAnimating: snapAnimationRef.current !== null,
  };
}
