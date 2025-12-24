'use client';

import { Suspense } from 'react';
import { Box, Sphere, Plane } from '@react-three/drei';
import { useStore } from '@/lib/store';

/**
 * Ultra-simplified scene for Quest 3 testing
 * No heavy assets, no complex geometry, just basics
 */
export function SimpleScene() {
  const settings = useStore((state) => state.settings);

  return (
    <Suspense fallback={null}>
      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Simple floor */}
      <Plane 
        args={[50, 50]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#1e293b" />
      </Plane>

      {/* Test robot placeholder - simple purple sphere */}
      <Sphere args={[2, 16, 16]} position={[0, 2, 0]} castShadow>
        <meshStandardMaterial color="#8b5cf6" />
      </Sphere>

      {/* Some simple cubes as reference points */}
      <Box args={[1, 1, 1]} position={[-5, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#ef4444" />
      </Box>
      
      <Box args={[1, 1, 1]} position={[5, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#10b981" />
      </Box>
      
      <Box args={[1, 1, 1]} position={[0, 0.5, 5]} castShadow>
        <meshStandardMaterial color="#3b82f6" />
      </Box>

      {/* Grid helper */}
      {settings.showGrid && (
        <gridHelper args={[50, 50, '#334155', '#1e293b']} />
      )}
    </Suspense>
  );
}

