/**
 * Converts rotation parameters (axis, layer, quarter turns) to Rubik's Cube notation.
 *
 * @module logic/move-converter
 */

import type { Coord } from "./coordinates";
import type { Move } from "./moves";
import type { Axis } from "./rotation";

type MoveKey = `${Axis}-${Coord}-${1 | 3}`;

/**
 * Mapping from rotation parameters to standard Rubik's Cube notation.
 *
 * Format: `${axis}-${layer}-${quarterTurns}`
 * - X-axis: Right face (1), Left face (-1), M slice (0)
 * - Y-axis: Up face (1), Down face (-1), E slice (0)
 * - Z-axis: Front face (1), Back face (-1), S slice (0)
 */
const MOVE_MAP: Record<MoveKey, Move> = {
  "x-1-1": "R'",
  "x-1-3": "R",
  "x--1-1": "L",
  "x--1-3": "L'",
  "x-0-1": "M",
  "x-0-3": "M'",

  "y-1-1": "U'",
  "y-1-3": "U",
  "y--1-1": "D",
  "y--1-3": "D'",
  "y-0-1": "E",
  "y-0-3": "E'",

  "z-1-1": "F'",
  "z-1-3": "F",
  "z--1-1": "B",
  "z--1-3": "B'",
  "z-0-1": "S",
  "z-0-3": "S'",
};

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
  layer: Coord,
  quarterTurns: number,
): Move | null {
  const normalized = ((quarterTurns % 4) + 4) % 4;
  if (normalized === 0 || normalized === 2) return null;

  const key: MoveKey = `${axis}-${layer}-${normalized as 1 | 3}`;
  return MOVE_MAP[key] ?? null;
}
