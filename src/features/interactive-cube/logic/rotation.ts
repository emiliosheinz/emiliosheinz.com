/**
 * Pure rotation math utilities for Rubik's Cube interactions.
 * Frame-invariant calculations using cube-local coordinate space.
 *
 * @module logic/rotation
 */

import * as THREE from "three";
import type { Coord } from "./coordinates";

export type Axis = "x" | "y" | "z";
export type FaceName = "right" | "left" | "up" | "down" | "front" | "back";

const MIN_ROTATION_AXIS_LENGTH = 0.001;

export type RotationInfo = {
  axis: Axis;
  layer: Coord;
  sign: number;
};

export type RotationState = {
  axis: Axis;
  layer: Coord;
  angle: number;
  sign: number;
};

/**
 * Identifies which face was hit based on a cube-local normal vector.
 */
export function getFaceFromLocalNormal(localNormal: THREE.Vector3): FaceName {
  const n = localNormal.clone().normalize();
  const absX = Math.abs(n.x);
  const absY = Math.abs(n.y);
  const absZ = Math.abs(n.z);

  if (absX > absY && absX > absZ) {
    return n.x > 0 ? "right" : "left";
  } else if (absY > absZ) {
    return n.y > 0 ? "up" : "down";
  } else {
    return n.z > 0 ? "front" : "back";
  }
}

/**
 * Snaps a vector to the nearest basis axis (±X, ±Y, ±Z).
 */
export function snapToAxis(v: THREE.Vector3): { axis: Axis; sign: number } {
  const absX = Math.abs(v.x);
  const absY = Math.abs(v.y);
  const absZ = Math.abs(v.z);

  if (absX > absY && absX > absZ) {
    return { axis: "x", sign: v.x > 0 ? 1 : -1 };
  } else if (absY > absZ) {
    return { axis: "y", sign: v.y > 0 ? 1 : -1 };
  } else {
    return { axis: "z", sign: v.z > 0 ? 1 : -1 };
  }
}

/**
 * Extracts the layer coordinate for a cubie given the rotation axis.
 */
export function getLayerFromPosition(
  cubiePos: [Coord, Coord, Coord],
  axis: Axis,
): Coord {
  return cubiePos[axis === "x" ? 0 : axis === "y" ? 1 : 2];
}

/**
 * Converts a world-space vector to cube-local space.
 */
export function worldToCubeLocal(
  worldVec: THREE.Vector3,
  cubeGroup: THREE.Group,
): THREE.Vector3 {
  const local = worldVec.clone();
  const invQuat = cubeGroup.quaternion.clone().invert();
  return local.applyQuaternion(invQuat);
}

/**
 * Projects a vector onto a plane perpendicular to a normal.
 * Returns normalized projection, or zero vector if projection is too small.
 */
export function projectToPlane(
  v: THREE.Vector3,
  normal: THREE.Vector3,
): THREE.Vector3 {
  const n = normal.clone().normalize();
  const projected = v.clone();
  projected.addScaledVector(n, -v.dot(n));

  if (projected.length() < MIN_ROTATION_AXIS_LENGTH) {
    return new THREE.Vector3(0, 0, 0);
  }

  return projected.normalize();
}

/**
 * Determines rotation axis, layer, and direction from a drag gesture in cube-local space.
 *
 * @param localNormal - Hit face normal in cube-local coordinates
 * @param localDragDir - Drag direction in cube-local coordinates
 * @param cubiePos - Position of dragged cubie
 * @returns Rotation information including axis, layer, and sign, or null if drag is too small
 */
export function determineRotation(
  localNormal: THREE.Vector3,
  localDragDir: THREE.Vector3,
  cubiePos: [Coord, Coord, Coord],
): RotationInfo | null {
  const n = localNormal.clone().normalize();
  const localDrag = projectToPlane(localDragDir, n);
  const localRotationAxis = new THREE.Vector3().crossVectors(n, localDrag);

  if (localRotationAxis.length() < MIN_ROTATION_AXIS_LENGTH) {
    return null;
  }

  localRotationAxis.normalize();
  const { axis, sign: axisSign } = snapToAxis(localRotationAxis);
  const layer = getLayerFromPosition(cubiePos, axis);

  const snappedAxisVec = new THREE.Vector3(
    axis === "x" ? axisSign : 0,
    axis === "y" ? axisSign : 0,
    axis === "z" ? axisSign : 0,
  );

  const rotationSign =
    localRotationAxis.dot(snappedAxisVec) < 0 ? -axisSign : axisSign;

  return { axis, layer, sign: rotationSign };
}

/**
 * Computes rotation angle from drag magnitude and direction.
 */
export function computeRotationAngle(
  dragMagnitude: number,
  sign: number,
  sensitivity: number = 0.01,
): number {
  return dragMagnitude * sensitivity * sign;
}

/**
 * Snaps an angle to the nearest quarter turn (90°).
 *
 * @returns Snapped angle in radians and number of quarter turns
 */
export function snapToQuarterTurn(angle: number): {
  snappedAngle: number;
  quarterTurns: number;
} {
  const quarterTurns = Math.round(angle / (Math.PI / 2));
  const snappedAngle = quarterTurns * (Math.PI / 2);
  return { snappedAngle, quarterTurns };
}
