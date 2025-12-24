'use client';

import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';

export function Telemetry() {
  const telemetry = useStore((state) => state.telemetry);
  const settings = useStore((state) => state.settings);

  if (!telemetry || !settings.showTelemetry) return null;

  return (
    <Html
      position={[-15, 4, 0]}
      transform
      occlude
      style={{
        width: '400px',
        pointerEvents: 'auto',
        cursor: 'move',
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl border border-slate-700">
        <h2 className="text-xl font-bold mb-3 text-cyan-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {telemetry.id}
        </h2>

        {/* Status */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status:</span>
            <span className={`font-semibold px-2 py-0.5 rounded text-sm ${
              telemetry.status.state === 'error' ? 'bg-red-500/20 text-red-400' :
              telemetry.status.state === 'navigating' ? 'bg-blue-500/20 text-blue-400' :
              telemetry.status.state === 'charging' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {telemetry.status.state.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-slate-400">Mode:</span>
            <span className="text-slate-200">{telemetry.status.mode}</span>
          </div>
        </div>

        {/* Battery */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400">Battery:</span>
            <span className="font-semibold text-cyan-300">{telemetry.battery.percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                telemetry.battery.percentage > 50 ? 'bg-green-500' :
                telemetry.battery.percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${telemetry.battery.percentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
            <div>
              <span className="text-slate-500">Voltage:</span>
              <div className="text-slate-300">{telemetry.battery.voltage.toFixed(1)}V</div>
            </div>
            <div>
              <span className="text-slate-500">Current:</span>
              <div className="text-slate-300">{telemetry.battery.current.toFixed(1)}A</div>
            </div>
            <div>
              <span className="text-slate-500">Temp:</span>
              <div className="text-slate-300">{telemetry.battery.temperature.toFixed(0)}°C</div>
            </div>
          </div>
        </div>

        {/* Position & Velocity */}
        <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-slate-400">Position:</span>
            <div className="font-mono text-xs text-slate-300 mt-1">
              X: {telemetry.position.x.toFixed(2)}m<br/>
              Y: {telemetry.position.y.toFixed(2)}m
            </div>
          </div>
          <div>
            <span className="text-slate-400">Velocity:</span>
            <div className="font-mono text-xs text-slate-300 mt-1">
              Lin: {telemetry.velocity.linear.toFixed(2)}m/s<br/>
              Ang: {telemetry.velocity.angular.toFixed(2)}rad/s
            </div>
          </div>
        </div>

        {/* Sensors */}
        <div className="mb-3">
          <span className="text-slate-400 text-sm">Sensors:</span>
          <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${telemetry.sensors.cameras.front ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-slate-300">Front Cam</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${telemetry.sensors.cameras.rear ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-slate-300">Rear Cam</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${telemetry.sensors.cameras.depth ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-slate-300">Depth Cam</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-300">LIDAR ({telemetry.sensors.lidar.points}pts)</span>
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="mb-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network:</span>
            <span className={`text-xs ${telemetry.network.connected ? 'text-green-400' : 'text-red-400'}`}>
              {telemetry.network.signalStrength.toFixed(0)}dBm / {telemetry.network.latency.toFixed(0)}ms
            </span>
          </div>
        </div>

        {/* Errors & Warnings */}
        {(telemetry.status.errors.length > 0 || telemetry.status.warnings.length > 0) && (
          <div className="border-t border-slate-700 pt-2">
            {telemetry.status.errors.map((error, i) => (
              <div key={i} className="text-xs text-red-400 mb-1">⚠ {error}</div>
            ))}
            {telemetry.status.warnings.map((warning, i) => (
              <div key={i} className="text-xs text-yellow-400 mb-1">⚠ {warning}</div>
            ))}
          </div>
        )}

        <div className="text-xs text-slate-500 mt-2 text-right">
          Updated: {new Date(telemetry.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </Html>
  );
}

