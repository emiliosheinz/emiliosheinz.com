/**
 * Hook for arcball-style cube rotation with momentum.
 * 
 * @module hooks/useArcballRotation
 */

import { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Quaternion, Vector2, Vector3 } from "three";

export interface ArcballRotationProps {
  groupRef: React.RefObject<Group | null>;
  autoRotate: boolean;
  allowManualRotation: boolean;
}

const DAMPING = 0.95;
const AUTO_ROTATE_SPEED = 0.1;
const ROTATION_SENSITIVITY = 0.001;

/**
 * Manages arcball-style cube rotation with mouse drag and momentum.
 */
export function useArcballRotation({
  groupRef,
  autoRotate,
  allowManualRotation,
}: ArcballRotationProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState<Vector2 | null>(null);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const { camera } = useThree();
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    if (autoRotate && !isDragging) {
      groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;
      groupRef.current.rotation.x -= delta * AUTO_ROTATE_SPEED;
    }
    
    if (!isDragging && allowManualRotation && 
        (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001)) {
      const cameraUp = new Vector3(0, 1, 0);
      const cameraRight = new Vector3(1, 0, 0);
      cameraRight.applyQuaternion(camera.quaternion);
      
      const angleX = velocityRef.current.y * delta * 60;
      const angleY = velocityRef.current.x * delta * 60;
      
      const qX = new Quaternion().setFromAxisAngle(cameraRight, angleX);
      const qY = new Quaternion().setFromAxisAngle(cameraUp, angleY);
      
      groupRef.current.quaternion.multiplyQuaternions(qY, groupRef.current.quaternion);
      groupRef.current.quaternion.multiplyQuaternions(qX, groupRef.current.quaternion);
      
      velocityRef.current.x *= DAMPING;
      velocityRef.current.y *= DAMPING;
      
      if (Math.abs(velocityRef.current.x) < 0.0001) velocityRef.current.x = 0;
      if (Math.abs(velocityRef.current.y) < 0.0001) velocityRef.current.y = 0;
    }
  });
  
  useEffect(() => {
    if (!allowManualRotation) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastPos(new Vector2(e.clientX, e.clientY));
      velocityRef.current = { x: 0, y: 0 };
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !groupRef.current || !lastPos) return;
      
      const deltaX = e.clientX - lastPos.x;
      const deltaY = e.clientY - lastPos.y;
      
      velocityRef.current = { 
        x: deltaX * ROTATION_SENSITIVITY, 
        y: deltaY * ROTATION_SENSITIVITY 
      };
      
      const cameraUp = new Vector3(0, 1, 0);
      const cameraRight = new Vector3(1, 0, 0);
      cameraRight.applyQuaternion(camera.quaternion);
      
      const angleX = deltaY * ROTATION_SENSITIVITY;
      const qX = new Quaternion().setFromAxisAngle(cameraRight, angleX);
      
      const angleY = deltaX * ROTATION_SENSITIVITY;
      const qY = new Quaternion().setFromAxisAngle(cameraUp, angleY);
      
      groupRef.current.quaternion.multiplyQuaternions(qY, groupRef.current.quaternion);
      groupRef.current.quaternion.multiplyQuaternions(qX, groupRef.current.quaternion);
      
      setLastPos(new Vector2(e.clientX, e.clientY));
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setLastPos(null);
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [allowManualRotation, isDragging, lastPos, camera, groupRef]);
}
