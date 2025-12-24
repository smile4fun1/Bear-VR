'use client';

import { useRef } from 'react';
import * as THREE from 'three';

export function Restaurant() {
  return (
    <group>
      {/* MASSIVE Floor - huge restaurant space */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 80]} />
        <meshStandardMaterial color="#2a1f1a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Walls - MUCH taller and wider */}
      {/* Back wall */}
      <mesh position={[0, 4, -40]} receiveShadow castShadow>
        <boxGeometry args={[60, 8, 0.5]} />
        <meshStandardMaterial color="#6b5d50" />
      </mesh>

      {/* Front wall (with double entrance) */}
      <mesh position={[-20, 4, 40]} receiveShadow castShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshStandardMaterial color="#6b5d50" />
      </mesh>
      <mesh position={[20, 4, 40]} receiveShadow castShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshStandardMaterial color="#6b5d50" />
      </mesh>
      {/* Wide entrance at center */}

      {/* Left wall */}
      <mesh position={[-30, 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 8, 80]} />
        <meshStandardMaterial color="#6b5d50" />
      </mesh>

      {/* Right wall with LARGE windows */}
      <mesh position={[30, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 2, 80]} />
        <meshStandardMaterial color="#6b5d50" />
      </mesh>
      <mesh position={[30, 7, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 2, 80]} />
        <meshStandardMaterial color="#6b5d50" />
      </mesh>

      {/* HUGE Windows on right wall */}
      {[-30, -20, -10, 0, 10, 20, 30].map((z, i) => (
        <mesh key={i} position={[30, 4, z]} castShadow>
          <boxGeometry args={[0.2, 4, 8]} />
          <meshStandardMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.4}
            metalness={0.9}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Tables with drop points */}
      <RestaurantTables />

      {/* High ceiling */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 80]} />
        <meshStandardMaterial color="#f0e8d8" side={THREE.DoubleSide} />
      </mesh>

      {/* More ceiling lights for large space */}
      {[
        [-20, -30], [0, -30], [20, -30],
        [-20, -15], [0, -15], [20, -15],
        [-20, 0], [0, 0], [20, 0],
        [-20, 15], [0, 15], [20, 15],
        [-20, 30], [0, 30], [20, 30],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 7.5, z]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffd700" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[0, -1, 0]} intensity={3} distance={15} color="#fff5e1" />
        </group>
      ))}
    </group>
  );
}

function RestaurantTables() {
  // MANY more tables spread across huge space
  const tables = [
    // Left column
    { id: 't1', x: -20, z: -30, label: 'Table 1' },
    { id: 't2', x: -20, z: -20, label: 'Table 2' },
    { id: 't3', x: -20, z: -10, label: 'Table 3' },
    { id: 't4', x: -20, z: 0, label: 'Table 4' },
    { id: 't5', x: -20, z: 10, label: 'Table 5' },
    { id: 't6', x: -20, z: 20, label: 'Table 6' },
    { id: 't7', x: -20, z: 30, label: 'Table 7' },
    
    // Center-left column
    { id: 't8', x: -10, z: -30, label: 'Table 8' },
    { id: 't9', x: -10, z: -20, label: 'Table 9' },
    { id: 't10', x: -10, z: -10, label: 'Table 10' },
    { id: 't11', x: -10, z: 0, label: 'Table 11' },
    { id: 't12', x: -10, z: 10, label: 'Table 12' },
    { id: 't13', x: -10, z: 20, label: 'Table 13' },
    { id: 't14', x: -10, z: 30, label: 'Table 14' },
    
    // Center column
    { id: 't15', x: 0, z: -30, label: 'Table 15' },
    { id: 't16', x: 0, z: -20, label: 'Table 16' },
    { id: 't17', x: 0, z: -10, label: 'Table 17' },
    { id: 't18', x: 0, z: 0, label: 'Table 18' },
    { id: 't19', x: 0, z: 10, label: 'Table 19' },
    { id: 't20', x: 0, z: 20, label: 'Table 20' },
    { id: 't21', x: 0, z: 30, label: 'Table 21' },
    
    // Center-right column
    { id: 't22', x: 10, z: -30, label: 'Table 22' },
    { id: 't23', x: 10, z: -20, label: 'Table 23' },
    { id: 't24', x: 10, z: -10, label: 'Table 24' },
    { id: 't25', x: 10, z: 0, label: 'Table 25' },
    { id: 't26', x: 10, z: 10, label: 'Table 26' },
    { id: 't27', x: 10, z: 20, label: 'Table 27' },
    { id: 't28', x: 10, z: 30, label: 'Table 28' },
    
    // Right column (near windows)
    { id: 't29', x: 20, z: -30, label: 'Table 29' },
    { id: 't30', x: 20, z: -20, label: 'Table 30' },
    { id: 't31', x: 20, z: -10, label: 'Table 31' },
    { id: 't32', x: 20, z: 0, label: 'Table 32' },
    { id: 't33', x: 20, z: 10, label: 'Table 33' },
    { id: 't34', x: 20, z: 20, label: 'Table 34' },
    { id: 't35', x: 20, z: 30, label: 'Table 35' },
  ];

  return (
    <>
      {tables.map((table) => (
        <group key={table.id} position={[table.x, 0, table.z]}>
          {/* BIGGER Table top */}
          <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 0.08, 32]} />
            <meshStandardMaterial color="#654321" metalness={0.4} roughness={0.6} />
          </mesh>

          {/* Thicker table leg */}
          <mesh position={[0, 0.375, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.75, 16]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>

          {/* BIGGER Drop point marker (glowing circle on floor) */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.7, 32]} />
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={0.8}
              transparent 
              opacity={0.7}
            />
          </mesh>

          {/* Brighter drop point indicator */}
          <mesh position={[0, 0.83, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial 
              color="#ff0000" 
              emissive="#ff0000" 
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

