'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

interface PlayerAvatarProps {
  userId: string;
  color: string;
  isLocal?: boolean;
}

export function PlayerAvatar({ userId, color, isLocal = false }: PlayerAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const { isPresenting, player } = useXR();

  useFrame(() => {
    if (!groupRef.current) return;

    if (isLocal && isPresenting) {
      // In VR: position avatar at player location
      groupRef.current.position.copy(player.position);
      groupRef.current.quaternion.copy(player.quaternion);
    } else if (isLocal && !isPresenting) {
      // Desktop: position avatar at camera location
      groupRef.current.position.copy(camera.position);
      groupRef.current.position.y -= 1.5; // Lower to ground level
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Name tag */}
      {!isLocal && (
        <mesh position={[0, 2, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.5, 0.15]} />
          <meshBasicMaterial color="#000000" opacity={0.7} transparent />
        </mesh>
      )}
    </group>
  );
}

