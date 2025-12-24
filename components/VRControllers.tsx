'use client';

import { useXR, useController } from '@react-three/xr';
import * as THREE from 'three';

export function VRControllers() {
  const { isPresenting } = useXR();
  
  if (!isPresenting) return null;

  return (
    <>
      <Controller hand="left" />
      <Controller hand="right" />
    </>
  );
}

function Controller({ hand }: { hand: 'left' | 'right' }) {
  const controller = useController(hand);

  if (!controller) return null;

  return (
    <group>
      {/* Controller model */}
      <mesh position={controller.grip?.position || [0, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.15]} />
        <meshStandardMaterial 
          color={hand === 'left' ? '#3b82f6' : '#ef4444'} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Pointer ray */}
      <mesh 
        position={controller.grip?.position || [0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.002, 0.002, 5, 8]} />
        <meshBasicMaterial 
          color={hand === 'left' ? '#3b82f6' : '#ef4444'}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

