'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

export function ServiRobot() {
  const groupRef = useRef<THREE.Group>(null);
  const telemetry = useStore((state) => state.telemetry);

  // Try to load the Servi model, fallback to placeholder
  let model;
  try {
    model = useGLTF('/models/servi.glb');
  } catch (e) {
    model = null;
  }

  useEffect(() => {
    if (groupRef.current && telemetry) {
      // Update position
      groupRef.current.position.set(
        telemetry.position.x,
        telemetry.position.z,
        -telemetry.position.y
      );

      // Update rotation from quaternion
      const q = new THREE.Quaternion(
        telemetry.rotation.x,
        telemetry.rotation.z,
        -telemetry.rotation.y,
        telemetry.rotation.w
      );
      groupRef.current.setRotationFromQuaternion(q);
    }
  }, [telemetry]);

  return (
    <group ref={groupRef}>
      {model && model.scene ? (
        <primitive object={model.scene.clone()} scale={0.5} />
      ) : (
        // Placeholder robot (simple box robot)
        <group>
          {/* Base */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.5, 1.2]} />
            <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.4} />
          </mesh>
          
          {/* Top shelf */}
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.1, 1.3]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Head/Sensor */}
          <mesh position={[0, 0.8, 0.3]} castShadow receiveShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
            <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Wheels */}
          <mesh position={[-0.35, 0.1, 0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0.35, 0.1, 0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[-0.35, 0.1, -0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0.35, 0.1, -0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
          </mesh>

          {/* Status light */}
          <mesh position={[0, 0.9, 0.5]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color={telemetry?.status.state === 'error' ? '#ef4444' : '#22c55e'}
              emissive={telemetry?.status.state === 'error' ? '#ef4444' : '#22c55e'}
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      )}

      {/* Trail line showing path */}
      {telemetry && (
        <pointLight
          position={[0, 1, 0]}
          intensity={0.5}
          distance={3}
          color="#2563eb"
        />
      )}
    </group>
  );
}

// Preload the model (optional, will fallback to placeholder)
useGLTF.preload('/models/servi.glb');

