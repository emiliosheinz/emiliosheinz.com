"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PointLight } from "three";
import * as Dialog from "@radix-ui/react-dialog";
import { Cube } from "./Cube";
import { useIsSpacePressed } from "./useIsSpacePressed";
import { useState } from "react";
import { createSolvedState } from "./cubeState";

export function InteractiveCube() {
  const [isFocused, setIsFocused] = useState(true);
  const isSpacePressed = useIsSpacePressed()

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
      <Cube state={createSolvedState()} />
      {isSpacePressed && (
        <OrbitControls autoRotate={!isFocused} enableZoom={false} />
      )}
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
