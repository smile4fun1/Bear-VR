'use client';

import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';

export function Terminal() {
  const settings = useStore((state) => state.settings);
  const terminalLines = useStore((state) => state.terminalLines);
  const addTerminalLine = useStore((state) => state.addTerminalLine);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  if (!settings.showTerminal) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addTerminalLine(`> ${input}`);

    // Simulate commands
    if (input.startsWith('ros2 topic list')) {
      setTimeout(() => {
        addTerminalLine('/robot/odom');
        addTerminalLine('/robot/cmd_vel');
        addTerminalLine('/robot/battery_state');
        addTerminalLine('/robot/diagnostics');
      }, 100);
    } else if (input.startsWith('ros2 topic echo')) {
      addTerminalLine('Echoing topic data...');
    } else if (input === 'clear') {
      useStore.getState().clearTerminal();
    } else {
      setTimeout(() => {
        addTerminalLine(`Command executed: ${input}`);
      }, 50);
    }

    setInput('');
  };

  return (
    <Html
      position={[15, 4, 0]}
      transform
      occlude
      style={{
        width: '500px',
        pointerEvents: 'auto',
        cursor: 'move',
      }}
    >
      <div className="bg-black/95 backdrop-blur-sm text-green-400 p-4 rounded-lg shadow-2xl border border-green-900 font-mono">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-900">
          <h3 className="text-sm font-bold">ROS 2 Terminal</h3>
          <button
            onClick={() => useStore.getState().updateSettings({ showTerminal: false })}
            className="text-green-600 hover:text-green-400 text-xs"
          >
            ✕
          </button>
        </div>

        <div
          ref={scrollRef}
          className="h-64 overflow-y-auto mb-2 text-xs leading-relaxed"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#22c55e #000' }}
        >
          {terminalLines.map((line, i) => (
            <div key={i} className={line.startsWith('>') ? 'text-cyan-400' : 'text-green-400'}>
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="flex gap-2">
          <span className="text-green-500">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-700 text-sm"
            placeholder="ros2 topic list"
            autoFocus
          />
        </form>

        <div className="mt-2 text-xs text-green-700">
          Hint: Try "ros2 topic list", "ros2 topic echo /robot/odom", "clear"
        </div>
      </div>
    </Html>
  );
}

