const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// ROS Simulator (inline implementation to avoid TS imports)
class ROSSimulator {
  constructor() {
    this.telemetry = this.getInitialTelemetry();
    this.listeners = [];
    this.interval = null;
  }

  getInitialTelemetry() {
    return {
      id: 'SERVI-001',
      timestamp: Date.now(),
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      velocity: { linear: 0, angular: 0 },
      battery: { percentage: 85, voltage: 48.2, current: 2.5, temperature: 32 },
      status: { state: 'idle', mode: 'autonomous', errors: [], warnings: [] },
      sensors: {
        lidar: { points: 1024, range: 10 },
        cameras: { front: true, rear: true, depth: true },
        imu: { pitch: 0, roll: 0, yaw: 0 },
        encoders: { left: 0, right: 0 },
      },
      network: { connected: true, signalStrength: -45, latency: 12 },
    };
  }

  start() {
    this.interval = setInterval(() => {
      this.updateTelemetry();
      this.notifyListeners();
    }, 100);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  updateTelemetry() {
    const now = Date.now();
    const t = now / 5000;
    const radius = 2;
    
    this.telemetry.position.x = Math.cos(t) * radius;
    this.telemetry.position.y = Math.sin(t) * radius;
    this.telemetry.velocity.linear = 0.5 + Math.random() * 0.2;
    this.telemetry.velocity.angular = Math.random() * 0.1 - 0.05;
    this.telemetry.battery.percentage = Math.max(20, this.telemetry.battery.percentage - 0.001);
    this.telemetry.sensors.imu.yaw = (t * 50) % 360;
    this.telemetry.network.latency = 10 + Math.random() * 20;
    this.telemetry.timestamp = now;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.telemetry));
  }

  getTelemetry() {
    return { ...this.telemetry };
  }
}

const simulator = new ROSSimulator();
simulator.start();

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });


  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Send initial telemetry
    socket.emit('telemetry', simulator.getTelemetry());

    // Subscribe to telemetry updates
    const unsubscribe = simulator.subscribe((telemetry) => {
      socket.emit('telemetry', telemetry);
    });

    // Handle user join
    socket.on('user:join', (user) => {
      console.log('User joined:', user.username);
      socket.broadcast.emit('user:joined', user);
    });

    // Handle user movement
    socket.on('user:move', ({ position, rotation }) => {
      socket.broadcast.emit('user:moved', socket.id, position, rotation);
    });

    // Handle annotations
    socket.on('annotation:add', (annotation) => {
      console.log('Annotation added:', annotation.text);
      socket.broadcast.emit('annotation:added', annotation);
    });

    // Handle terminal commands
    socket.on('terminal:command', (command) => {
      console.log('Terminal command:', command);
      
      setTimeout(() => {
        socket.emit('terminal:output', `Executing: ${command}`);
        
        // Mock ROS 2 command responses
        if (command.includes('ros2 topic list')) {
          socket.emit('terminal:output', '/robot/odom');
          socket.emit('terminal:output', '/robot/cmd_vel');
          socket.emit('terminal:output', '/robot/battery_state');
          socket.emit('terminal:output', '/robot/scan');
          socket.emit('terminal:output', '/robot/diagnostics');
        } else if (command.includes('ros2 topic echo')) {
          socket.emit('terminal:output', '---');
          socket.emit('terminal:output', 'position: {x: 1.2, y: 0.5, z: 0.0}');
          socket.emit('terminal:output', 'velocity: {linear: 0.5, angular: 0.0}');
          socket.emit('terminal:output', '---');
        } else if (command === 'clear') {
          // Client handles clear
        } else {
          socket.emit('terminal:output', `Command completed: ${command}`);
        }
      }, 100);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
      unsubscribe();
      socket.broadcast.emit('user:left', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Ready on http://${hostname}:${port}`);
      console.log(`🥽 WebXR ready for Meta Quest 3`);
    });
});

