'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

export function VRInterface() {
  const isPresenting = false; // VR mode disabled for now
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const addAnnotation = useStore((state) => state.addAnnotation);
  const currentUser = useStore((state) => state.currentUser);
  const telemetry = useStore((state) => state.telemetry);
  const isConnected = useStore((state) => state.isConnected);

  const [showSettings, setShowSettings] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [showAnnotationInput, setShowAnnotationInput] = useState(false);

  const handleAddAnnotation = () => {
    if (!annotationText.trim() || !currentUser || !telemetry) return;

    const annotation = {
      id: uuidv4(),
      userId: currentUser.id,
      username: currentUser.username,
      position: [telemetry.position.x, 1, -telemetry.position.y] as [number, number, number],
      text: annotationText,
      timestamp: Date.now(),
      color: currentUser.color,
    };

    addAnnotation(annotation);
    setAnnotationText('');
    setShowAnnotationInput(false);
  };

  return (
    <>
      {/* Main Control Panel */}
      <Html
        position={[0, 6, 10]}
        transform
        occlude
        style={{ width: '600px', pointerEvents: 'auto', cursor: 'move' }}
      >
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm text-white p-6 rounded-2xl shadow-2xl border border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Servi VR Diagnostics
            </h1>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-sm text-slate-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* User Info */}
          {currentUser && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentUser.color }}></div>
                <div>
                  <div className="text-sm font-semibold">{currentUser.username}</div>
                  <div className="text-xs text-slate-400">
                    {currentUser.role === 'controller' ? '🎮 Controller' : '👁 Viewer'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => setShowAnnotationInput(!showAnnotationInput)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              📝 Annotate
            </button>
            <button
              onClick={() => updateSettings({ showTerminal: !settings.showTerminal })}
              className={`${settings.showTerminal ? 'bg-green-600' : 'bg-slate-700'} hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}
            >
              💻 Terminal
            </button>
            <button
              onClick={() => updateSettings({ showMap: !settings.showMap })}
              className={`${settings.showMap ? 'bg-yellow-600' : 'bg-slate-700'} hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}
            >
              🗺️ Map
            </button>
          </div>

          {/* VR Status */}
          {isPresenting && (
            <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-3 text-center">
              <div className="text-cyan-300 font-semibold">🥽 VR Mode Active</div>
              <div className="text-xs text-cyan-400/70 mt-1">
                Use controllers to interact
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-slate-800/70 rounded-lg border border-slate-600">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">Settings</h3>

              <div className="space-y-3">
                {/* Environment */}
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Environment</label>
                  <select
                    value={settings.environment}
                    onChange={(e) => updateSettings({ environment: e.target.value as any })}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="lab">Lab</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="office">Office</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showGrid}
                      onChange={(e) => updateSettings({ showGrid: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Show Grid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showAxes}
                      onChange={(e) => updateSettings({ showAxes: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Show Axes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showTelemetry}
                      onChange={(e) => updateSettings({ showTelemetry: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Show Telemetry</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showAnnotations}
                      onChange={(e) => updateSettings({ showAnnotations: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Show Annotations</span>
                  </label>
                </div>

                {/* Shadow Quality */}
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Shadow Quality</label>
                  <select
                    value={settings.shadowQuality}
                    onChange={(e) => updateSettings({ shadowQuality: e.target.value as any })}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Annotation Input */}
          {showAnnotationInput && (
            <div className="mt-4 p-4 bg-purple-900/30 rounded-lg border border-purple-500/50">
              <h3 className="text-lg font-semibold mb-3 text-purple-300">Add Annotation</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  placeholder="Enter annotation text..."
                  className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAnnotation()}
                />
                <button
                  onClick={handleAddAnnotation}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="text-xs text-purple-300/70 mt-2">
                Annotation will be placed at robot's current position
              </div>
            </div>
          )}
        </div>
      </Html>
    </>
  );
}

