'use client';

import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';
import * as THREE from 'three';

export function Annotations() {
  const annotations = useStore((state) => state.annotations);
  const settings = useStore((state) => state.settings);
  const removeAnnotation = useStore((state) => state.removeAnnotation);

  if (!settings.showAnnotations) return null;

  return (
    <>
      {annotations.map((annotation) => (
        <group key={annotation.id} position={annotation.position}>
          {/* Marker sphere */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={annotation.color}
              emissive={annotation.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Vertical line */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
            <meshBasicMaterial color={annotation.color} transparent opacity={0.6} />
          </mesh>

          {/* Text label */}
          <Html
            position={[0, 1.2, 0]}
            center
            distanceFactor={6}
            style={{ pointerEvents: 'auto' }}
          >
            <div
              className="bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl border max-w-xs"
              style={{ borderColor: annotation.color }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold mb-1" style={{ color: annotation.color }}>
                    {annotation.username}
                  </div>
                  <div className="text-sm">{annotation.text}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(annotation.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => removeAnnotation(annotation.id)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

