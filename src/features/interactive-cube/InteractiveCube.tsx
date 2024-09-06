"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PointLight } from "three";
import { Cube } from "./Cube";
import { useIsSpacePressed } from "./useIsSpacePressed";

export function InteractiveCube() {
  const isSpacePressed = useIsSpacePressed() || true;

  return (
    <>
      <Canvas
        camera={{ position: [6, 6, 6], fov: 30 }}
        onCreated={({ camera, scene }) => {
          const light = new PointLight();
          light.position.set(0, 1, 0);
          light.intensity = 300;

          camera.add(light);
          scene.add(camera);
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Cube />
        {isSpacePressed && <OrbitControls autoRotate enableZoom={false} />}
        <ambientLight intensity={0.3} />
      </Canvas>
    </>
  );
}
