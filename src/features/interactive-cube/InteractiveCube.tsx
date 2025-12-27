"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointLight, Quaternion, Vector2, Vector3 } from "three";
import * as Dialog from "@radix-ui/react-dialog";
import { Cube } from "./Cube";
import { useIsSpacePressed } from "./useIsSpacePressed";
import React, { useState, useRef, useEffect } from "react";
import { createSolvedState } from "./cubeState";
import { Group } from "three";

function RotatableCubeWrapper({ 
  cubeState, 
  onStateChange,
  autoRotate,
  allowPieceRotation,
  allowManualRotation
}: { 
  cubeState: any;
  onStateChange: (state: any) => void;
  autoRotate: boolean;
  allowPieceRotation: boolean;
  allowManualRotation: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState<Vector2 | null>(null);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const { size, camera } = useThree();
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Auto-rotate when not focused
    if (autoRotate && !isDragging) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x -= delta * 0.1;
    }
    
    // Apply momentum when not dragging
    if (!isDragging && allowManualRotation && (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001)) {
      const cameraUp = new Vector3(0, 1, 0);
      const cameraRight = new Vector3(1, 0, 0);
      cameraRight.applyQuaternion(camera.quaternion);
      
      const angleX = velocityRef.current.y * delta * 60; // Normalize to 60fps
      const angleY = velocityRef.current.x * delta * 60;
      
      const qX = new Quaternion().setFromAxisAngle(cameraRight, angleX);
      const qY = new Quaternion().setFromAxisAngle(cameraUp, angleY);
      
      groupRef.current.quaternion.multiplyQuaternions(qY, groupRef.current.quaternion);
      groupRef.current.quaternion.multiplyQuaternions(qX, groupRef.current.quaternion);
      
      // Apply damping
      const damping = 0.95;
      velocityRef.current.x *= damping;
      velocityRef.current.y *= damping;
      
      // Stop if velocity is very small
      if (Math.abs(velocityRef.current.x) < 0.0001) velocityRef.current.x = 0;
      if (Math.abs(velocityRef.current.y) < 0.0001) velocityRef.current.y = 0;
    }
  });
  
  // Arcball rotation - rotate cube around camera's up and right vectors
  useEffect(() => {
    if (!allowManualRotation) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastPos(new Vector2(e.clientX, e.clientY));
      velocityRef.current = { x: 0, y: 0 }; // Reset velocity on new drag
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !groupRef.current || !lastPos) return;
      
      const deltaX = e.clientX - lastPos.x;
      const deltaY = e.clientY - lastPos.y;
      
      // Store velocity for momentum
      velocityRef.current = { x: deltaX * 0.001, y: deltaY * 0.001 };
      
      // Get camera's right and up vectors
      const cameraUp = new Vector3(0, 1, 0);
      const cameraRight = new Vector3(1, 0, 0);
      cameraRight.applyQuaternion(camera.quaternion);
      
      // Rotate around camera's right vector (vertical drag)
      const angleX = deltaY * 0.001;
      const qX = new Quaternion().setFromAxisAngle(cameraRight, angleX);
      
      // Rotate around world up vector (horizontal drag)
      const angleY = deltaX * 0.001;
      const qY = new Quaternion().setFromAxisAngle(cameraUp, angleY);
      
      // Apply rotations
      groupRef.current.quaternion.multiplyQuaternions(qY, groupRef.current.quaternion);
      groupRef.current.quaternion.multiplyQuaternions(qX, groupRef.current.quaternion);
      
      setLastPos(new Vector2(e.clientX, e.clientY));
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setLastPos(null);
      // Don't reset velocity - let momentum continue
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [allowManualRotation, isDragging, lastPos, camera]);
  
  return (
    <group ref={groupRef}>
      <Cube 
        state={cubeState} 
        onStateChange={onStateChange}
        disableDrag={!allowPieceRotation}
      />
    </group>
  );
}

export function InteractiveCube() {
  const [cubeState, setCubeState] = useState(createSolvedState());
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
      <RotatableCubeWrapper 
        cubeState={cubeState} 
        onStateChange={setCubeState}
        autoRotate={!isFocused && !isSpacePressed}
        allowPieceRotation={!isSpacePressed}
        allowManualRotation={isSpacePressed}
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
