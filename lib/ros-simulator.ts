import { ServiTelemetry } from './types';

export class ROSSimulator {
  private telemetry: ServiTelemetry;
  private interval: NodeJS.Timeout | null = null;
  private listeners: ((telemetry: ServiTelemetry) => void)[] = [];

  constructor() {
    this.telemetry = this.getInitialTelemetry();
  }

  private getInitialTelemetry(): ServiTelemetry {
    return {
      id: 'SERVI-001',
      timestamp: Date.now(),
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      velocity: { linear: 0, angular: 0 },
      battery: {
        percentage: 85,
        voltage: 48.2,
        current: 2.5,
        temperature: 32,
      },
      status: {
        state: 'idle',
        mode: 'autonomous',
        errors: [],
        warnings: [],
      },
      sensors: {
        lidar: { points: 1024, range: 10 },
        cameras: { front: true, rear: true, depth: true },
        imu: { pitch: 0, roll: 0, yaw: 0 },
        encoders: { left: 0, right: 0 },
      },
      network: {
        connected: true,
        signalStrength: -45,
        latency: 12,
      },
    };
  }

  start() {
    this.interval = setInterval(() => {
      this.updateTelemetry();
      this.notifyListeners();
    }, 100); // 10Hz update rate
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private updateTelemetry() {
    const now = Date.now();
    const dt = 0.1; // 100ms

    // Simulate movement (circular path)
    const t = now / 5000;
    const radius = 2;
    this.telemetry.position.x = Math.cos(t) * radius;
    this.telemetry.position.y = Math.sin(t) * radius;
    
    // Update rotation (facing direction of movement)
    const angle = Math.atan2(this.telemetry.velocity.linear, this.telemetry.velocity.angular);
    this.telemetry.rotation.z = Math.sin(angle / 2);
    this.telemetry.rotation.w = Math.cos(angle / 2);

    // Simulate velocity
    this.telemetry.velocity.linear = 0.5 + Math.random() * 0.2;
    this.telemetry.velocity.angular = Math.random() * 0.1 - 0.05;

    // Battery drain
    this.telemetry.battery.percentage = Math.max(
      20,
      this.telemetry.battery.percentage - 0.001
    );
    this.telemetry.battery.voltage = 44 + (this.telemetry.battery.percentage / 100) * 4;
    this.telemetry.battery.current = 2 + Math.random() * 2;
    this.telemetry.battery.temperature = 30 + Math.random() * 5;

    // Random state changes
    if (Math.random() < 0.001) {
      const states: ServiTelemetry['status']['state'][] = [
        'idle', 'navigating', 'docked', 'charging'
      ];
      this.telemetry.status.state = states[Math.floor(Math.random() * states.length)];
    }

    // Simulate occasional errors/warnings
    if (Math.random() < 0.002) {
      this.telemetry.status.warnings.push(`Warning: ${Math.random() > 0.5 ? 'Low battery' : 'High CPU usage'}`);
      if (this.telemetry.status.warnings.length > 5) {
        this.telemetry.status.warnings.shift();
      }
    }

    // IMU updates
    this.telemetry.sensors.imu.pitch = Math.sin(t * 2) * 2;
    this.telemetry.sensors.imu.roll = Math.cos(t * 3) * 1;
    this.telemetry.sensors.imu.yaw = (t * 50) % 360;

    // Network fluctuation
    this.telemetry.network.signalStrength = -40 + Math.random() * -10;
    this.telemetry.network.latency = 10 + Math.random() * 20;

    this.telemetry.timestamp = now;
  }

  subscribe(listener: (telemetry: ServiTelemetry) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.telemetry));
  }

  getTelemetry(): ServiTelemetry {
    return { ...this.telemetry };
  }

  // Control methods for future ROS integration
  setVelocity(linear: number, angular: number) {
    this.telemetry.velocity.linear = linear;
    this.telemetry.velocity.angular = angular;
  }

  setPosition(x: number, y: number) {
    this.telemetry.position.x = x;
    this.telemetry.position.y = y;
  }
}

// Singleton instance
let simulator: ROSSimulator | null = null;

export function getSimulator(): ROSSimulator {
  if (!simulator) {
    simulator = new ROSSimulator();
    simulator.start();
  }
  return simulator;
}

