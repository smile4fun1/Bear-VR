export interface Robot {
  id: string;
  name: string;
  active: boolean;
  color: string;
}

export interface ServiTelemetry {
  id: string;
  timestamp: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  velocity: { linear: number; angular: number };
  battery: {
    percentage: number;
    voltage: number;
    current: number;
    temperature: number;
  };
  status: {
    state: 'idle' | 'navigating' | 'docked' | 'charging' | 'error' | 'emergency';
    mode: 'autonomous' | 'manual' | 'remote';
    errors: string[];
    warnings: string[];
  };
  sensors: {
    lidar: { points: number; range: number };
    cameras: { front: boolean; rear: boolean; depth: boolean };
    imu: { pitch: number; roll: number; yaw: number };
    encoders: { left: number; right: number };
  };
  network: {
    connected: boolean;
    signalStrength: number;
    latency: number;
  };
}

export interface Annotation {
  id: string;
  userId: string;
  username: string;
  position: [number, number, number];
  text: string;
  timestamp: number;
  color: string;
}

export interface User {
  id: string;
  username: string;
  role: 'viewer' | 'controller';
  position: [number, number, number];
  rotation: [number, number, number, number];
  color: string;
}

export interface MapData {
  id: string;
  name: string;
  occupancyGrid: number[][];
  resolution: number;
  origin: { x: number; y: number };
  waypoints: { id: string; x: number; y: number; label: string }[];
  obstacles: { id: string; x: number; y: number; radius: number }[];
}

export interface VRSettings {
  environment: 'lab' | 'warehouse' | 'restaurant' | 'office';
  showGrid: boolean;
  showAxes: boolean;
  showTelemetry: boolean;
  showTerminal: boolean;
  showMap: boolean;
  showAnnotations: boolean;
  shadowQuality: 'low' | 'medium' | 'high';
}

