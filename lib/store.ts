import { create } from 'zustand';
import { ServiTelemetry, Annotation, User, MapData, VRSettings, Robot } from './types';

interface AppState {
  // Telemetry
  telemetry: ServiTelemetry | null;
  setTelemetry: (telemetry: ServiTelemetry) => void;

  // Users
  users: Map<string, User>;
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUserPosition: (userId: string, position: [number, number, number], rotation: [number, number, number, number]) => void;

  // Annotations
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (id: string) => void;

  // Map
  mapData: MapData | null;
  setMapData: (map: MapData) => void;
  addWaypoint: (x: number, y: number, label: string) => void;
  removeWaypoint: (id: string) => void;

  // VR Settings
  settings: VRSettings;
  updateSettings: (settings: Partial<VRSettings>) => void;

  // Terminal
  terminalLines: string[];
  addTerminalLine: (line: string) => void;
  clearTerminal: () => void;

  // Connection
  isConnected: boolean;
  setConnected: (connected: boolean) => void;

  // Multi-robot support
  robots: Robot[];
  activeRobotId: string;
  addRobot: (robot: Robot) => void;
  removeRobot: (id: string) => void;
  setActiveRobot: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Telemetry
  telemetry: null,
  setTelemetry: (telemetry) => set({ telemetry }),

  // Users
  users: new Map(),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  addUser: (user) =>
    set((state) => {
      const newUsers = new Map(state.users);
      newUsers.set(user.id, user);
      return { users: newUsers };
    }),
  removeUser: (userId) =>
    set((state) => {
      const newUsers = new Map(state.users);
      newUsers.delete(userId);
      return { users: newUsers };
    }),
  updateUserPosition: (userId, position, rotation) =>
    set((state) => {
      const user = state.users.get(userId);
      if (user) {
        const newUsers = new Map(state.users);
        newUsers.set(userId, { ...user, position, rotation });
        return { users: newUsers };
      }
      return state;
    }),

  // Annotations
  annotations: [],
  addAnnotation: (annotation) =>
    set((state) => ({ annotations: [...state.annotations, annotation] })),
  removeAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
    })),

  // Map
  mapData: null,
  setMapData: (map) => set({ mapData: map }),
  addWaypoint: (x, y, label) =>
    set((state) => {
      if (!state.mapData) return state;
      const newWaypoint = {
        id: `wp-${Date.now()}`,
        x,
        y,
        label,
      };
      return {
        mapData: {
          ...state.mapData,
          waypoints: [...state.mapData.waypoints, newWaypoint],
        },
      };
    }),
  removeWaypoint: (id) =>
    set((state) => {
      if (!state.mapData) return state;
      return {
        mapData: {
          ...state.mapData,
          waypoints: state.mapData.waypoints.filter((w) => w.id !== id),
        },
      };
    }),

  // VR Settings
  settings: {
    environment: 'lab',
    showGrid: true,
    showAxes: true,
    showTelemetry: true,
    showTerminal: false,
    showMap: false,
    showAnnotations: true,
    shadowQuality: 'medium',
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // Terminal
  terminalLines: ['> Servi VR Diagnostics Terminal v1.0', '> Ready'],
  addTerminalLine: (line) =>
    set((state) => ({
      terminalLines: [...state.terminalLines, line].slice(-100), // Keep last 100 lines
    })),
  clearTerminal: () => set({ terminalLines: [] }),

  // Connection
  isConnected: false,
  setConnected: (connected) => set({ isConnected: connected }),

  // Multi-robot support
  robots: [{ id: 'SERVI-001', name: 'Servi 1', active: true, color: '#2563eb' }],
  activeRobotId: 'SERVI-001',
  addRobot: (robot) =>
    set((state) => ({ robots: [...state.robots, robot] })),
  removeRobot: (id) =>
    set((state) => ({ robots: state.robots.filter((r) => r.id !== id) })),
  setActiveRobot: (id) => set({ activeRobotId: id }),
}));

