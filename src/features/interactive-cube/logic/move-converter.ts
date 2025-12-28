/**
 * Converts rotation parameters (axis, layer, quarter turns) to Rubik's Cube notation.
 * 
 * @module logic/move-converter
 */

import type { Coord } from "./coordinates";
import type { Axis } from "./rotation";
import type { Move } from "./moves";

/**
 * Converts rotation parameters to standard Rubik's Cube move notation.
 * 
 * Standard notation defines moves by looking AT each face from outside:
 * - Positive axis rotation appears counter-clockwise when viewing from outside
 * - This is because we're looking in the opposite direction of the axis
 * 
 * @param axis - Rotation axis (x, y, or z)
 * @param layer - Layer coordinate on the rotation axis (-1, 0, or 1)
 * @param quarterTurns - Number of 90° turns (can be negative)
 * @returns Move in standard notation or null if no rotation
 */
export function convertToMove(
  axis: Axis,
  layer: Coord | 0,
  quarterTurns: number,
): Move | null {
  const normalized = ((quarterTurns % 4) + 4) % 4;

  if (normalized === 0) return null;

  if (layer === 0) {
    return getMiddleLayerMove(axis, normalized);
  }

  return getOuterLayerMove(axis, layer, normalized);
}

function getMiddleLayerMove(axis: Axis, normalized: number): Move | null {
  if (axis === "x") {
    if (normalized === 1) return "M";
    if (normalized === 3) return "M'";
  } else if (axis === "y") {
    if (normalized === 1) return "E";
    if (normalized === 3) return "E'";
  } else if (axis === "z") {
    if (normalized === 1) return "S";
    if (normalized === 3) return "S'";
  }
  return null;
}

function getOuterLayerMove(
  axis: Axis,
  layer: Coord,
  normalized: number,
): Move | null {
  if (axis === "x") {
    if (layer === 1) {
      if (normalized === 1) return "R'";
      if (normalized === 3) return "R";
    } else if (layer === -1) {
      if (normalized === 1) return "L";
      if (normalized === 3) return "L'";
    }
  } else if (axis === "y") {
    if (layer === 1) {
      if (normalized === 1) return "U'";
      if (normalized === 3) return "U";
    } else if (layer === -1) {
      if (normalized === 1) return "D";
      if (normalized === 3) return "D'";
    }
  } else if (axis === "z") {
    if (layer === 1) {
      if (normalized === 1) return "F'";
      if (normalized === 3) return "F";
    } else if (layer === -1) {
      if (normalized === 1) return "B";
      if (normalized === 3) return "B'";
    }
  }

  return null;
}
