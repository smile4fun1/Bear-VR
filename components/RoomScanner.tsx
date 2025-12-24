'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';

export function RoomScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [savedRooms, setSavedRooms] = useState<string[]>([
    'Restaurant Main Floor',
    'Kitchen Area',
    'Storage Room'
  ]);

  const handleStartScan = () => {
    // In future: trigger Quest 3 room scan API
    // For now: simulate
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert('Room scan complete! (Quest 3 integration coming soon)');
    }, 3000);
  };

  return (
    <Html
      position={[-15, 4, -10]}
      transform
      occlude
      style={{ width: '320px', pointerEvents: 'auto', cursor: 'move' }}
    >
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl border border-slate-700">
        <h3 className="text-lg font-bold mb-3 text-purple-400">🗺️ Room Scanner</h3>

        {/* Scan button */}
        <button
          onClick={handleStartScan}
          disabled={isScanning}
          className={`w-full mb-3 py-3 px-4 rounded-lg font-semibold transition-colors ${
            isScanning 
              ? 'bg-yellow-600 cursor-wait' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isScanning ? '⏳ Scanning...' : '📷 Scan Room (Quest 3)'}
        </button>

        {/* Saved rooms */}
        <div className="mb-3">
          <div className="text-sm text-slate-400 mb-2">Saved Rooms ({savedRooms.length})</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {savedRooms.map((room, i) => (
              <div
                key={i}
                className="bg-slate-800 px-3 py-2 rounded text-sm flex items-center justify-between hover:bg-slate-700 cursor-pointer"
              >
                <span>{room}</span>
                <button className="text-purple-400 hover:text-purple-300">Load</button>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-2">
          💡 Quest 3 integration coming soon. Will use native Scene API for room scanning.
        </div>
      </div>
    </Html>
  );
}

