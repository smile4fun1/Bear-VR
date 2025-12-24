'use client';

import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';
import { useState } from 'react';

export function MapEditor() {
  const settings = useStore((state) => state.settings);
  const mapData = useStore((state) => state.mapData);
  const telemetry = useStore((state) => state.telemetry);
  const addWaypoint = useStore((state) => state.addWaypoint);
  const removeWaypoint = useStore((state) => state.removeWaypoint);
  const [waypointLabel, setWaypointLabel] = useState('');

  if (!settings.showMap || !mapData) return null;

  const handleAddWaypoint = () => {
    if (!telemetry || !waypointLabel.trim()) return;
    addWaypoint(telemetry.position.x, telemetry.position.y, waypointLabel);
    setWaypointLabel('');
  };

  return (
    <>
      {/* Map Grid Visualization */}
      <group position={[0, 0.01, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20, 40, 40]} />
          <meshStandardMaterial
            color="#1e293b"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* Waypoints */}
      {mapData.waypoints.map((waypoint) => (
        <group key={waypoint.id} position={[waypoint.x, 0.1, -waypoint.y]}>
          {/* Waypoint marker */}
          <mesh>
            <coneGeometry args={[0.15, 0.3, 8]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Waypoint label */}
          <Html center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
            <div className="bg-yellow-500/20 backdrop-blur-sm text-yellow-200 px-2 py-1 rounded border border-yellow-500/50 text-xs whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span>{waypoint.label}</span>
                <button
                  onClick={() => removeWaypoint(waypoint.id)}
                  className="text-yellow-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* Obstacles */}
      {mapData.obstacles.map((obstacle) => (
        <mesh
          key={obstacle.id}
          position={[obstacle.x, 0.5, -obstacle.y]}
          castShadow
        >
          <cylinderGeometry args={[obstacle.radius, obstacle.radius, 1, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* Map Control Panel */}
      <Html
        position={[0, 6, -15]}
        transform
        occlude
        style={{ width: '350px', pointerEvents: 'auto', cursor: 'move' }}
      >
        <div className="bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl border border-slate-700">
          <h3 className="text-lg font-bold mb-3 text-yellow-400">Map Editor</h3>

          <div className="mb-3">
            <span className="text-slate-400 text-sm">Map: {mapData.name}</span>
            <div className="text-xs text-slate-500 mt-1">
              Resolution: {mapData.resolution}m/cell
            </div>
          </div>

          <div className="mb-3">
            <label className="text-slate-400 text-sm block mb-1">Add Waypoint</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={waypointLabel}
                onChange={(e) => setWaypointLabel(e.target.value)}
                placeholder="Waypoint name"
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-yellow-500"
              />
              <button
                onClick={handleAddWaypoint}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm font-semibold"
              >
                Add
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Waypoint will be placed at robot's current position
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-sm mb-2">Waypoints ({mapData.waypoints.length})</div>
            <div className="max-h-32 overflow-y-auto text-xs space-y-1">
              {mapData.waypoints.map((wp) => (
                <div
                  key={wp.id}
                  className="flex items-center justify-between bg-slate-800 px-2 py-1 rounded"
                >
                  <span className="text-slate-300">{wp.label}</span>
                  <span className="text-slate-500 font-mono">
                    ({wp.x.toFixed(1)}, {wp.y.toFixed(1)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </>
  );
}

