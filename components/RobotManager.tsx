'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';

export function RobotManager() {
  const robots = useStore((state) => state.robots);
  const activeRobotId = useStore((state) => state.activeRobotId);
  const addRobot = useStore((state) => state.addRobot);
  const removeRobot = useStore((state) => state.removeRobot);
  const setActiveRobot = useStore((state) => state.setActiveRobot);
  const [showAdd, setShowAdd] = useState(false);
  const [newRobotName, setNewRobotName] = useState('');

  const handleAddRobot = () => {
    if (!newRobotName.trim()) return;
    
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const newRobot = {
      id: `SERVI-${String(robots.length + 1).padStart(3, '0')}`,
      name: newRobotName,
      active: true,
      color: colors[robots.length % colors.length],
    };
    
    addRobot(newRobot);
    setNewRobotName('');
    setShowAdd(false);
  };

  return (
    <Html
      position={[15, 4, -10]}
      transform
      occlude
      style={{ width: '320px', pointerEvents: 'auto', cursor: 'move' }}
    >
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl border border-slate-700">
        <h3 className="text-lg font-bold mb-3 text-cyan-400">🤖 Robot Fleet</h3>

        {/* Add robot button */}
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-full mb-3 py-2 px-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors"
        >
          + Add Robot
        </button>

        {/* Add robot form */}
        {showAdd && (
          <div className="mb-3 p-3 bg-slate-800/70 rounded-lg">
            <input
              type="text"
              value={newRobotName}
              onChange={(e) => setNewRobotName(e.target.value)}
              placeholder="Robot name"
              className="w-full mb-2 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-cyan-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddRobot()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddRobot}
                className="flex-1 bg-green-600 hover:bg-green-700 py-1 rounded text-sm font-semibold"
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Robots list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {robots.map((robot) => (
            <div
              key={robot.id}
              className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                robot.id === activeRobotId
                  ? 'bg-cyan-600/30 border border-cyan-500'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              onClick={() => setActiveRobot(robot.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: robot.color }}
                ></div>
                <div>
                  <div className="font-semibold">{robot.name}</div>
                  <div className="text-xs text-slate-400">{robot.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {robot.id === activeRobotId && (
                  <span className="text-xs bg-cyan-500 px-2 py-1 rounded">Active</span>
                )}
                {robots.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove ${robot.name}?`)) {
                        removeRobot(robot.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-500 mt-3 border-t border-slate-700 pt-2">
          Click robot to switch view. Active robot shows in scene.
        </div>
      </div>
    </Html>
  );
}

