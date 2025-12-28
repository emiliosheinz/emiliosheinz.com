import { 
  getFaceFromLocalNormal, 
  snapToAxis, 
  getLayerFromPosition,
  projectToPlane,
  computeRotationAngle,
  snapToQuarterTurn,
  determineRotation,
} from "../logic/rotation";
import * as THREE from "three";

describe("rotation", () => {
  describe("getFaceFromLocalNormal", () => {
    it("should identify right face", () => {
      expect(getFaceFromLocalNormal(new THREE.Vector3(1, 0, 0))).toBe("right");
    });

    it("should identify left face", () => {
      expect(getFaceFromLocalNormal(new THREE.Vector3(-1, 0, 0))).toBe("left");
    });

    it("should identify up face", () => {
      expect(getFaceFromLocalNormal(new THREE.Vector3(0, 1, 0))).toBe("up");
    });

    it("should identify down face", () => {
      expect(getFaceFromLocalNormal(new THREE.Vector3(0, -1, 0))).toBe("down");
    });

    it("should identify front face", () => {
      expect(getFaceFromLocalNormal(new THREE.Vector3(0, 0, 1))).toBe("front");
    });

    it("should identify back face", () => {
      expect(getFaceFromLocalNormal(new THREE.Vector3(0, 0, -1))).toBe("back");
    });
  });

  describe("snapToAxis", () => {
    it("should snap to +X axis", () => {
      const result = snapToAxis(new THREE.Vector3(0.8, 0.2, 0.1));
      expect(result.axis).toBe("x");
      expect(result.sign).toBe(1);
    });

    it("should snap to -Y axis", () => {
      const result = snapToAxis(new THREE.Vector3(0.1, -0.9, 0.2));
      expect(result.axis).toBe("y");
      expect(result.sign).toBe(-1);
    });

    it("should snap to +Z axis", () => {
      const result = snapToAxis(new THREE.Vector3(0.1, 0.2, 0.7));
      expect(result.axis).toBe("z");
      expect(result.sign).toBe(1);
    });
  });

  describe("getLayerFromPosition", () => {
    it("should get X layer", () => {
      expect(getLayerFromPosition([1, 0, -1], "x")).toBe(1);
    });

    it("should get Y layer", () => {
      expect(getLayerFromPosition([1, -1, 0], "y")).toBe(-1);
    });

    it("should get Z layer", () => {
      expect(getLayerFromPosition([0, 1, 0], "z")).toBe(0);
    });
  });

  describe("projectToPlane", () => {
    it("should project vector onto plane perpendicular to normal", () => {
      const v = new THREE.Vector3(1, 1, 0);
      const normal = new THREE.Vector3(0, 1, 0);
      const projected = projectToPlane(v, normal);
      
      expect(projected.y).toBeCloseTo(0);
      expect(projected.x).toBeCloseTo(1);
    });

    it("should return normalized vector", () => {
      const v = new THREE.Vector3(3, 2, 0);
      const normal = new THREE.Vector3(0, 1, 0);
      const projected = projectToPlane(v, normal);
      
      expect(projected.length()).toBeCloseTo(1);
    });
  });

  describe("computeRotationAngle", () => {
    it("should compute positive angle", () => {
      const angle = computeRotationAngle(100, 1, 0.01);
      expect(angle).toBe(1);
    });

    it("should compute negative angle", () => {
      const angle = computeRotationAngle(50, -1, 0.02);
      expect(angle).toBe(-1);
    });
  });

  describe("snapToQuarterTurn", () => {
    it("should snap to 0 for small angles", () => {
      const result = snapToQuarterTurn(0.1);
      expect(result.quarterTurns).toBe(0);
      expect(result.snappedAngle).toBe(0);
    });

    it("should snap to +1 quarter turn", () => {
      const result = snapToQuarterTurn(Math.PI / 2.5);
      expect(result.quarterTurns).toBe(1);
      expect(result.snappedAngle).toBeCloseTo(Math.PI / 2);
    });

    it("should snap to -1 quarter turn", () => {
      const result = snapToQuarterTurn(-Math.PI / 2.5);
      expect(result.quarterTurns).toBe(-1);
      expect(result.snappedAngle).toBeCloseTo(-Math.PI / 2);
    });

    it("should snap to +2 quarter turns", () => {
      const result = snapToQuarterTurn(Math.PI * 0.9);
      expect(result.quarterTurns).toBe(2);
      expect(result.snappedAngle).toBeCloseTo(Math.PI);
    });
  });

  describe("determineRotation", () => {
    it("should determine Y-axis rotation from front face horizontal drag", () => {
      const normal = new THREE.Vector3(0, 0, 1);
      const drag = new THREE.Vector3(1, 0, 0);
      const position: [number, number, number] = [0, 1, 1];
      
      const result = determineRotation(normal, drag, position);
      
      expect(result.axis).toBe("y");
      expect(result.layer).toBe(1);
    });

    it("should determine X-axis rotation from top face horizontal drag", () => {
      const normal = new THREE.Vector3(0, 1, 0);
      const drag = new THREE.Vector3(0, 0, 1);
      const position: [number, number, number] = [1, 1, 0];
      
      const result = determineRotation(normal, drag, position);
      
      expect(result.axis).toBe("x");
      expect(result.layer).toBe(1);
    });
  });
});
