'use client';

import { useRef, useState, ReactNode } from 'react';

interface DraggablePanelProps {
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  initialZ?: number;
}

export function DraggablePanel({ 
  children, 
  initialX = 0, 
  initialY = 2, 
  initialZ = 0 
}: DraggablePanelProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY, z: initialZ });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, z: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || 
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x * 100,
      y: e.clientY - position.y * 100,
      z: position.z
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = (e.clientX - dragStart.current.x) / 100;
    const newY = (dragStart.current.y - e.clientY) / 100;
    
    setPosition({ x: newX, y: newY, z: position.z });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <group 
      position={[position.x, position.y, position.z]}
      onPointerDown={handleMouseDown as any}
      onPointerMove={handleMouseMove as any}
      onPointerUp={handleMouseUp as any}
    >
      {children}
    </group>
  );
}

