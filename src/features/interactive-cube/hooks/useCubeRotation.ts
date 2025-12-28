/**
 * Hook for managing cube layer rotation state and snap animations.
 * 
 * @module hooks/useCubeRotation
 */

import { useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import type { Axis } from "../logic/rotation";
import type { Coord } from "../logic/coordinates";
import type { FaceName } from "../logic/rotation";

export interface RotationState {
  axis: Axis;
  layer: Coord;
  angle: number;
  startFace: FaceName;
  sign: number;
  cumulativeAngle: number;
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

const SNAP_DURATION_MS = 250;

/**
 * Manages cube layer rotation state and smooth snap animations.
 * 
 * @returns Rotation controls including state and animation functions
 */
export function useCubeRotation(): CubeRotationControls {
  const [rotationState, setRotationState] = useState<RotationState | null>(null);
  const [snapAnimation, setSnapAnimation] = useState<SnapAnimation | null>(null);

  useFrame(() => {
    if (!snapAnimation) return;

    const now = performance.now();
    const elapsed = now - snapAnimation.startTime;
    const progress = Math.min(elapsed / snapAnimation.duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    const currentAngle =
      snapAnimation.startAngle +
      (snapAnimation.targetAngle - snapAnimation.startAngle) * eased;

    setRotationState({
      axis: snapAnimation.axis,
      layer: snapAnimation.layer,
      angle: currentAngle,
      startFace: "front",
      sign: 1,
      cumulativeAngle: currentAngle,
    });

    if (progress >= 1) {
      snapAnimation.onComplete();
      setSnapAnimation(null);
    }
  });

  const startSnapAnimation = useCallback(
    (config: Omit<SnapAnimation, "startTime">) => {
      setSnapAnimation({
        ...config,
        startTime: performance.now(),
      });
    },
    [],
  );

  return {
    rotationState,
    setRotationState,
    startSnapAnimation,
    isAnimating: snapAnimation !== null,
  };
}
