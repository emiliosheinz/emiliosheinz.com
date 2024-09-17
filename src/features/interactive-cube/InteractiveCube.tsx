"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PointLight } from "three";
import * as Dialog from "@radix-ui/react-dialog";
import { Cube } from "./Cube";
import { useIsSpacePressed } from "./useIsSpacePressed";
import { useState } from "react";

export function InteractiveCube() {
  const [isFocused, setIsFocused] = useState(false);
  const isSpacePressed = useIsSpacePressed() || true;

  console.log(isFocused);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Canvas
          camera={{ position: [6, 6, 6], fov: 30 }}
          onCreated={({ camera, scene }) => {
            const light = new PointLight();
            light.position.set(0, 1, 0);
            light.intensity = 300;

            camera.add(light);
            scene.add(camera);
          }}
        >
          <Cube />
          {isSpacePressed && <OrbitControls autoRotate enableZoom={false} />}
          <ambientLight intensity={0.3} />
        </Canvas>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content>
          <Dialog.Title>Interactive Cube</Dialog.Title>
          <Dialog.Description>
            Click and drag to rotate the cube. Press space to auto-rotate.
          </Dialog.Description>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
