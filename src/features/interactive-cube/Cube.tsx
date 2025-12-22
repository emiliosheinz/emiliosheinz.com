import React from "react";
import { FaceName } from "./types";
import { Cubie } from "./Cubie";

export interface CubeRef {
  rotateFace(faceName: FaceName, inversed: boolean): void;
  scrambleFaces(): void;
}

export const Cube = React.forwardRef<CubeRef, {}>((_, ref) => {
  return (
    <React.Suspense fallback={null}>
      <Cubie
        position={[-1, 1, 1]}
        upColor="yellow"
        leftColor="red"
        frontColor="green"
      />
      <Cubie position={[0, 1, 1]} upColor="yellow" frontColor="green" />
      <Cubie
        position={[1, 1, 1]}
        upColor="yellow"
        rightColor="orange"
        frontColor="green"
      />
      <Cubie position={[-1, 0, 1]} frontColor="green" leftColor="red" />
      <Cubie position={[0, 0, 1]} frontColor="green" />
      <Cubie position={[1, 0, 1]} frontColor="green" rightColor="orange" />
      <Cubie
        position={[-1, -1, 1]}
        leftColor="red"
        frontColor="green"
        downColor="white"
      />
      <Cubie position={[0, -1, 1]} frontColor="green" downColor="white" />
      <Cubie
        position={[1, -1, 1]}
        rightColor="orange"
        frontColor="green"
        downColor="white"
      />
      <Cubie position={[-1, 1, 0]} upColor="yellow" leftColor="red" />
      <Cubie position={[0, 1, 0]} upColor="yellow" />
      <Cubie position={[1, 1, 0]} upColor="yellow" rightColor="orange" />
      <Cubie position={[-1, 0, 0]} leftColor="red" />
      <Cubie position={[0, 0, 0]} />
      <Cubie position={[1, 0, 0]} rightColor="orange" />
      <Cubie position={[-1, -1, 0]} leftColor="red" downColor="white" />
      <Cubie position={[0, -1, 0]} downColor="white" />
      <Cubie position={[1, -1, 0]} rightColor="orange" downColor="white" />
      <Cubie
        position={[-1, 1, -1]}
        backColor="blue"
        upColor="yellow"
        leftColor="red"
      />
      <Cubie position={[0, 1, -1]} backColor="blue" upColor="yellow" />
      <Cubie
        position={[1, 1, -1]}
        backColor="blue"
        upColor="yellow"
        rightColor="orange"
      />
      <Cubie position={[-1, 0, -1]} backColor="blue" leftColor="red" />
      <Cubie position={[0, 0, -1]} backColor="blue" />
      <Cubie position={[1, 0, -1]} backColor="blue" rightColor="orange" />
      <Cubie
        position={[-1, -1, -1]}
        leftColor="red"
        backColor="blue"
        downColor="white"
      />
      <Cubie position={[0, -1, -1]} backColor="blue" downColor="white" />
      <Cubie
        position={[1, -1, -1]}
        rightColor="orange"
        backColor="blue"
        downColor="white"
      />
    </React.Suspense>
  );
});

Cube.displayName = "Cube";
