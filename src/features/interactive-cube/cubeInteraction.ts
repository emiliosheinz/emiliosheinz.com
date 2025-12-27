/**
 * Cube Interaction Math - Frame-Invariant Rubik's Cube Rotation Logic
 * 
 * COORDINATE SYSTEM:
 * - Cube-local: +X=Right, +Y=Up, +Z=Front (right-handed)
 * - Faces: R(+X), L(-X), U(+Y), D(-Y), F(+Z), B(-Z)
 * - Layers identified by coordinate on the rotation axis: -1, 0, +1
 * 
 * INTERACTION STRATEGY:
 * 1. Convert raycast hit normal and screen drag from world to cube-local space
 * 2. Compute cross(localNormal, localDrag) to get rotation axis
 * 3. This is frame-invariant: works regardless of cube orientation
 * 4. Snap axis to nearest basis, determine layer, apply rotation in local space
 * 
 * WHY LOCAL SPACE:
 * - Rotations are applied to cube structure in its local coordinate frame
 * - Converting drag to local space makes it relative to cube's current orientation
 * - Cross product in local space gives axis that's always aligned with cube axes
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
 * 
 * Strategy: Work in world space where screen projection is natural,
 * then convert final result to cube-local space.
 */
export function computeLocalDragDirection(
  screenDelta: { x: number; y: number },
  camera: THREE.Camera,
  cubeGroup: THREE.Group,
  faceNormal: THREE.Vector3, // World-space normal of clicked face
): THREE.Vector3 {
  // Get camera's world-space basis vectors
  const cameraRight = new THREE.Vector3();
  const cameraUp = new THREE.Vector3();
  camera.matrixWorld.extractBasis(cameraRight, cameraUp, new THREE.Vector3());
  
  // Build world-space drag vector from screen delta
  // Screen X → camera right, Screen Y → camera up (inverted)
  const worldDrag = new THREE.Vector3()
    .addScaledVector(cameraRight, screenDelta.x)
    .addScaledVector(cameraUp, -screenDelta.y);
  
  // Project world drag onto the face plane (perpendicular to world normal)
  const n = faceNormal.clone().normalize();
  const worldDragInPlane = projectToPlane(worldDrag, n);
  
  // Convert to cube-local space
  return worldToCubeLocal(worldDragInPlane, cubeGroup);
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
 * 
 * ALL calculations in CUBE-LOCAL space for frame-invariant behavior.
 * 
 * @param localNormal - Hit face normal in CUBE-LOCAL space (±X/±Y/±Z)
 * @param localDragDir - Drag direction in CUBE-LOCAL space
 * @param cubiePos - Position of the dragged cubie in cube-local coords [-1|0|1, -1|0|1, -1|0|1]
 * @param cubeGroup - The cube group (for logging only now)
 * @returns RotationInfo with axis, layer, sign, and debug info
 */
export function determineRotation(
  localNormal: THREE.Vector3,
  localDragDir: THREE.Vector3,
  cubiePos: [Coord, Coord, Coord],
  cubeGroup: THREE.Group,
): RotationInfo {
  const n = localNormal.clone().normalize();
  const faceName = getFaceFromLocalNormal(n);

  // Project drag direction onto face plane (in local space)
  const localDrag = projectToPlane(localDragDir, n).normalize();

  // Rotation axis = cross(normal, drag) in LOCAL space
  // This is frame-invariant: always gives correct axis relative to cube structure
  const localRotationAxis = new THREE.Vector3().crossVectors(n, localDrag);
  
  if (localRotationAxis.length() < 0.001) {
    // Degenerate case - drag is parallel to normal
    console.warn("Degenerate drag: parallel to normal");
    return {
      axis: "x",
      layer: 0,
      sign: 1,
      faceName,
      localNormal: n,
      localDragDir: localDrag,
      rawCross: localRotationAxis,
    };
  }
  
  localRotationAxis.normalize();

  console.log(
    `  🔧 Local-space cross product:`,
    `\n    Local Normal: [${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)}]`,
    `\n    Local Drag: [${localDrag.x.toFixed(2)}, ${localDrag.y.toFixed(2)}, ${localDrag.z.toFixed(2)}]`,
    `\n    Cross result: [${localRotationAxis.x.toFixed(2)}, ${localRotationAxis.y.toFixed(2)}, ${localRotationAxis.z.toFixed(2)}]`
  );

  // Snap to nearest basis axis
  const { axis, sign: axisSign } = snapToAxis(localRotationAxis);

  // Determine the layer on this axis
  const layer = getLayerFromCubiePosition(cubiePos, axis);

  // Determine rotation sign
  let rotationSign = axisSign;
  
  // Verify sign using dot product
  const snappedAxisVec = new THREE.Vector3();
  if (axis === "x") snappedAxisVec.set(axisSign, 0, 0);
  else if (axis === "y") snappedAxisVec.set(0, axisSign, 0);
  else snappedAxisVec.set(0, 0, axisSign);

  const dotProduct = localRotationAxis.dot(snappedAxisVec);
  if (dotProduct < 0) {
    rotationSign *= -1;
  }

  return {
    axis,
    layer,
    sign: rotationSign,
    faceName,
    localNormal: n,
    localDragDir: localDrag,
    rawCross: localRotationAxis,
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
