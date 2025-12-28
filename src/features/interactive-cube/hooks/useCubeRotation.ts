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

/**
 * Manages cube layer rotation state and smooth snap animations.
 */
export function useCubeRotation(): CubeRotationControls {
  const [rotationState, setRotationState] = useState<RotationState | null>(null);
  const [snapAnimation, setSnapAnimation] = useState<SnapAnimation | null>(null);
  const pendingClearRef = useRef(false);

  useFrame(() => {
    // Clear rotation state one frame after callback executes
    if (pendingClearRef.current) {
      setRotationState(null);
      pendingClearRef.current = false;
      return;
    }

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
      sign: 1,
      cumulativeAngle: currentAngle,
    });

    if (progress >= 1) {
      // Keep rotation at target angle for one more frame
      setRotationState({
        axis: snapAnimation.axis,
        layer: snapAnimation.layer,
        angle: snapAnimation.targetAngle,
        sign: 1,
        cumulativeAngle: snapAnimation.targetAngle,
      });
      
      setSnapAnimation(null);
      snapAnimation.onComplete();
      
      // Schedule rotation clear for next frame
      pendingClearRef.current = true;
    }
  });

  const startSnapAnimation = useCallback(
    (config: Omit<SnapAnimation, "startTime">) => {
      if (config.duration <= 0) {
        config.onComplete();
        return;
      }
      
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
