/**
 * Cube Interaction Math - Frame-Invariant Rubik's Cube Rotation Logic
 * 
 * COORDINATE SYSTEM:
 * - Cube-local: +X=Right, +Y=Up, +Z=Front (right-handed)
 * - Faces: R(+X), L(-X), U(+Y), D(-Y), F(+Z), B(-Z)
 * - Layers identified by coordinate on the rotation axis: -1, 0, +1
 * 
 * INTERACTION STRATEGY:
 * 1. Convert raycast hit normal and drag vector to cube-local space
 * 2. Identify face by dominant component of local normal
 * 3. Compute drag direction in face plane (local space)
 * 4. Rotation axis = snap(cross(normal, drag)) to nearest basis axis
 * 5. Layer = cubie coord perpendicular to rotation axis
 * 6. Sign = dot(snapped_axis, raw_cross) determines CW/CCW
 */

import * as THREE from "three";
import { Coord } from "./mapping";

export type Axis = "x" | "y" | "z";
export type FaceName = "right" | "left" | "up" | "down" | "front" | "back";

/**
 * Result of determining rotation from a drag gesture
 */
export interface RotationInfo {
  axis: Axis;
  layer: Coord;
  sign: number; // +1 or -1 for rotation direction
  faceName: FaceName;
  localNormal: THREE.Vector3;
  localDragDir: THREE.Vector3;
  rawCross: THREE.Vector3;
}

/**
 * Identify which face was hit based on local-space normal
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
 * Snap a vector to the nearest basis axis (±X, ±Y, ±Z)
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
 * Get the layer coordinate for a cubie given the rotation axis.
 * Layer is determined by the cubie's coordinate on the rotation axis itself.
 */
export function getLayerFromCubiePosition(
  cubiePos: [Coord, Coord, Coord],
  axis: Axis,
): Coord {
  const [x, y, z] = cubiePos;
  switch (axis) {
    case "x":
      return x;
    case "y":
      return y;
    case "z":
      return z;
  }
}

/**
 * Convert world-space vector to cube-local space using cube group's inverse transform
 */
export function worldToCubeLocal(
  worldVec: THREE.Vector3,
  cubeGroup: THREE.Group,
): THREE.Vector3 {
  // Clone and apply inverse of cube rotation
  const local = worldVec.clone();
  const invQuat = cubeGroup.quaternion.clone().invert();
  local.applyQuaternion(invQuat);
  return local;
}

/**
 * Compute drag direction in cube-local space from screen delta.
 * Uses camera's right/up vectors converted to cube-local frame.
 */
export function computeLocalDragDirection(
  screenDelta: { x: number; y: number },
  camera: THREE.Camera,
  cubeGroup: THREE.Group,
): THREE.Vector3 {
  // Get camera's world-space basis vectors
  const cameraRight = new THREE.Vector3();
  const cameraUp = new THREE.Vector3();
  camera.matrixWorld.extractBasis(cameraRight, cameraUp, new THREE.Vector3());

  // Build world-space drag vector from screen delta
  const worldDrag = new THREE.Vector3()
    .addScaledVector(cameraRight, screenDelta.x)
    .addScaledVector(cameraUp, -screenDelta.y) // Y is inverted in screen coords
    .normalize();

  // Convert to cube-local space
  return worldToCubeLocal(worldDrag, cubeGroup);
}

/**
 * Project a vector onto the plane perpendicular to a normal
 */
export function projectToPlane(
  v: THREE.Vector3,
  normal: THREE.Vector3,
): THREE.Vector3 {
  const n = normal.clone().normalize();
  const projected = v.clone();
  projected.addScaledVector(n, -v.dot(n));
  return projected.normalize();
}

/**
 * Determine rotation axis, layer, and sign from drag gesture.
 * All input vectors must be in cube-local space.
 * 
 * @param localNormal - Hit face normal in cube-local coords
 * @param localDragDir - Drag direction in cube-local coords (raw, not necessarily in-plane)
 * @param cubiePos - Position of the dragged cubie [-1|0|1, -1|0|1, -1|0|1]
 * @returns RotationInfo with axis, layer, sign, and debug info
 */
export function determineRotation(
  localNormal: THREE.Vector3,
  localDragDir: THREE.Vector3,
  cubiePos: [Coord, Coord, Coord],
): RotationInfo {
  const n = localNormal.clone().normalize();
  const faceName = getFaceFromLocalNormal(n);

  // Project drag direction onto face plane
  const dragInPlane = projectToPlane(localDragDir, n);

  // Rotation axis = cross(normal, dragInPlane)
  // Right-hand rule: fingers curl from N to D, thumb points along axis
  const rawCross = new THREE.Vector3().crossVectors(n, dragInPlane).normalize();

  // Snap to nearest basis axis
  const { axis, sign: axisSign } = snapToAxis(rawCross);

  // Determine the layer on this axis
  const layer = getLayerFromCubiePosition(cubiePos, axis);

  // Determine rotation sign:
  // The raw cross product gives us a direction. We've snapped it to ±axis.
  // The sign of rotation should match the sign of the component of rawCross along the snapped axis.
  let rotationSign = axisSign;
  
  // Adjust sign based on the actual dot product to handle all orientations correctly
  const snappedAxisVec = new THREE.Vector3();
  if (axis === "x") snappedAxisVec.set(axisSign, 0, 0);
  else if (axis === "y") snappedAxisVec.set(0, axisSign, 0);
  else snappedAxisVec.set(0, 0, axisSign);

  const dotProduct = rawCross.dot(snappedAxisVec);
  if (dotProduct < 0) {
    rotationSign *= -1;
  }

  return {
    axis,
    layer,
    sign: rotationSign,
    faceName,
    localNormal: n,
    localDragDir: dragInPlane,
    rawCross,
  };
}

/**
 * Compute signed angle of rotation from drag magnitude and direction.
 * 
 * @param dragMagnitude - Magnitude of screen-space drag in pixels
 * @param sign - Rotation direction from determineRotation
 * @param sensitivity - Pixels to radians conversion factor
 */
export function computeRotationAngle(
  dragMagnitude: number,
  sign: number,
  sensitivity: number = 0.01,
): number {
  return dragMagnitude * sensitivity * sign;
}

/**
 * Snap angle to nearest quarter turn and get number of quarter turns
 */
export function snapToQuarterTurn(angle: number): {
  snappedAngle: number;
  quarterTurns: number;
} {
  const quarterTurns = Math.round(angle / (Math.PI / 2));
  const snappedAngle = quarterTurns * (Math.PI / 2);
  return { snappedAngle, quarterTurns };
}
