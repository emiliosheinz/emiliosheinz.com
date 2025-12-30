/**
 * Interactive Rubik's Cube with modal view and rotation controls.
 *
 * @module components/InteractiveCube
 */

"use client";

import { Canvas } from "@react-three/fiber";
import { PointLight, Group } from "three";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useState, useRef } from "react";
import { Cube } from "./Cube";
import { useIsSpacePressed } from "../hooks/useIsSpacePressed";
import { useArcballRotation } from "../hooks/useArcballRotation";

interface RotatableCubeWrapperProps {
  autoRotate: boolean;
  allowPieceRotation: boolean;
  allowManualRotation: boolean;
}

function RotatableCubeWrapper({
  autoRotate,
  allowPieceRotation,
  allowManualRotation,
}: RotatableCubeWrapperProps) {
  const groupRef = useRef<Group>(null);

  useArcballRotation({
    groupRef,
    autoRotate,
    allowManualRotation,
  });

  return (
    <group ref={groupRef} name="cube-group">
      <Cube disableDrag={!allowPieceRotation} cubeGroupRef={groupRef} />
    </group>
  );
}

export function InteractiveCube() {
  const [isFocused, setIsFocused] = useState(false);
  const isSpacePressed = useIsSpacePressed();

  const canvas = (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [6, 6, 6], fov: 30 }}
      onCreated={({ camera, scene }) => {
        const light = new PointLight();
        light.position.set(10, 10, 10);
        light.intensity = 100;

        camera.add(light);
        scene.add(camera);
      }}
      onDoubleClick={() => setIsFocused(true)}
    >
      <RotatableCubeWrapper
        autoRotate={!isFocused}
        allowPieceRotation={isFocused && !isSpacePressed}
        allowManualRotation={!isFocused || isSpacePressed}
      />
      <ambientLight intensity={8} />
    </Canvas>
  );

  return (
    <Dialog.Root open={isFocused} onOpenChange={setIsFocused}>
      {canvas}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/90" />
        <Dialog.Content className="fixed z-40 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full h-full ">
          {canvas}
          <Dialog.Close />
          <Dialog.Title>Interactive Rubiks Cube</Dialog.Title>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
