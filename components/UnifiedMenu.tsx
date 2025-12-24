'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';
import { Telemetry } from './Telemetry';
import { Terminal } from './Terminal';
import { RoomScanner } from './RoomScanner';
import { RobotManager } from './RobotManager';

export function UnifiedMenu() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'terminal' | 'robots' | 'scanner'>('telemetry');

  if (!isOpen) {
    return (
      <Html position={[0, 6, 10]} transform occlude style={{ pointerEvents: 'auto' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-2xl"
        >
          📱 Open Menu
        </button>
      </Html>
    );
  }

  return (
    <Html
      position={[0, 6, 10]}
      transform
      occlude
      style={{ width: '800px', pointerEvents: 'auto', cursor: 'move' }}
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Header with tabs */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">Servi VR Control Center</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          
          <div className="flex gap-2">
            {[
              { id: 'telemetry', icon: '📊', label: 'Telemetry' },
              { id: 'terminal', icon: '💻', label: 'Terminal' },
              { id: 'robots', icon: '🤖', label: 'Robots' },
              { id: 'scanner', icon: '🗺️', label: 'Scanner' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600'
                    : 'bg-purple-800/50 hover:bg-purple-700/50 text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          {activeTab === 'telemetry' && <TelemetryContent />}
          {activeTab === 'terminal' && <TerminalContent />}
          {activeTab === 'robots' && <RobotsContent />}
          {activeTab === 'scanner' && <ScannerContent />}
        </div>
      </div>
    </Html>
  );
}

function TelemetryContent() {
  const telemetry = useStore((state) => state.telemetry);
  
  if (!telemetry) return <div>No telemetry data</div>;

  return (
    <div className="space-y-4">
      {/* Battery */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2 text-cyan-400">Battery</h3>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Charge</span>
            <span className="font-bold">{telemetry.battery.percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                telemetry.battery.percentage > 50 ? 'bg-green-500' :
                telemetry.battery.percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${telemetry.battery.percentage}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div><span className="text-slate-400">V:</span> {telemetry.battery.voltage.toFixed(1)}V</div>
          <div><span className="text-slate-400">A:</span> {telemetry.battery.current.toFixed(1)}A</div>
          <div><span className="text-slate-400">T:</span> {telemetry.battery.temperature.toFixed(0)}°C</div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2 text-cyan-400">Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>State:</span>
            <span className="font-bold uppercase">{telemetry.status.state}</span>
          </div>
          <div className="flex justify-between">
            <span>Mode:</span>
            <span>{telemetry.status.mode}</span>
          </div>
        </div>
      </div>

      {/* Position */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2 text-cyan-400">Position</h3>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div>X: {telemetry.position.x.toFixed(2)}m</div>
          <div>Y: {telemetry.position.y.toFixed(2)}m</div>
          <div>Vel: {telemetry.velocity.linear.toFixed(2)}m/s</div>
          <div>Ang: {telemetry.velocity.angular.toFixed(2)}rad/s</div>
        </div>
      </div>
    </div>
  );
}

function TerminalContent() {
  const terminalLines = useStore((state) => state.terminalLines);
  const addTerminalLine = useStore((state) => state.addTerminalLine);
  const [input, setInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    addTerminalLine(`> ${input}`);
    
    if (input.startsWith('ros2 topic list')) {
      setTimeout(() => {
        addTerminalLine('/robot/odom');
        addTerminalLine('/robot/cmd_vel');
        addTerminalLine('/robot/battery_state');
      }, 100);
    } else {
      setTimeout(() => addTerminalLine(`Executed: ${input}`), 50);
    }
    
    setInput('');
  };

  return (
    <div className="bg-black p-4 rounded-lg font-mono text-green-400">
      <div className="h-64 overflow-y-auto mb-3 text-sm">
        {terminalLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-green-500">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-green-400"
          placeholder="ros2 topic list"
        />
      </form>
    </div>
  );
}

function RobotsContent() {
  const robots = useStore((state) => state.robots);
  const activeRobotId = useStore((state) => state.activeRobotId);
  const setActiveRobot = useStore((state) => state.setActiveRobot);
  const addRobot = useStore((state) => state.addRobot);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addRobot({
      id: `SERVI-${String(robots.length + 1).padStart(3, '0')}`,
      name: newName,
      active: true,
      color: ['#2563eb', '#10b981', '#f59e0b'][robots.length % 3],
    });
    setNewName('');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New robot name"
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white outline-none"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
        >
          Add
        </button>
      </div>
      
      {robots.map((robot) => (
        <div
          key={robot.id}
          onClick={() => setActiveRobot(robot.id)}
          className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${
            robot.id === activeRobotId ? 'bg-cyan-600/30 border border-cyan-500' : 'bg-slate-800'
          }`}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: robot.color }} />
          <div className="flex-1">
            <div className="font-bold">{robot.name}</div>
            <div className="text-xs text-slate-400">{robot.id}</div>
          </div>
          {robot.id === activeRobotId && (
            <span className="text-xs bg-cyan-500 px-2 py-1 rounded">Active</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ScannerContent() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setScanning(true);
          setTimeout(() => setScanning(false), 3000);
        }}
        disabled={scanning}
        className={`w-full py-4 rounded-lg font-bold text-lg ${
          scanning ? 'bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {scanning ? '⏳ Scanning Room...' : '📷 Scan Room (Quest 3)'}
      </button>
      
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="font-bold mb-3">Saved Rooms</h3>
        {['Restaurant Main Floor', 'Kitchen Area', 'Storage Room'].map((room, i) => (
          <div key={i} className="bg-slate-700 p-2 rounded mb-2 flex justify-between items-center">
            <span>{room}</span>
            <button className="text-purple-400 hover:text-purple-300 text-sm">Load</button>
          </div>
        ))}
      </div>
    </div>
  );
}

