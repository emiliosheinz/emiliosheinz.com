/**
 * Interactive Rubik's Cube with modal view and rotation controls.
 *
 * @module components/InteractiveCube
 */

"use client";

import { Canvas } from "@react-three/fiber";
import { PointLight, Group } from "three";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useState, useRef, useEffect } from "react";
import { Cube } from "./cube";
import { useIsSpacePressed } from "../hooks/use-is-space-pressed";
import { useArcballRotation } from "../hooks/use-arcball-rotation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Cross, CrossIcon, LucideCross, X } from "lucide-react";
import { Button } from "~/components/ui/button";

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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>(null);

  const isSpacePressed = useIsSpacePressed();

  useEffect(() => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(true);
    }, 3000);

    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

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
      onClick={() => setIsFocused(true)}
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
      <Tooltip
        open={isTooltipOpen}
        delayDuration={250}
        onOpenChange={(isOpen) => {
          setIsTooltipOpen(isOpen);
          console.log(tooltipTimeoutRef.current);
          if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
          }
        }}
      >
        <TooltipTrigger asChild>{canvas}</TooltipTrigger>
        <TooltipContent side="left">
          <p>Click me to have some fun!</p>
        </TooltipContent>
      </Tooltip>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/90" />
        <Dialog.Content className="fixed z-40 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full h-full flex justify-center items-center">
          <div className="w-[90%] h-[90%]">{canvas}</div>
          <Dialog.Close asChild>
            <Button size="icon" variant="ghost" className="absolute top-5 right-5">
              <X className="size-5"/>
            </Button>
          </Dialog.Close>
          <Dialog.Title className="hidden">
            Interactive Rubiks Cube
          </Dialog.Title>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
