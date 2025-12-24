import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { getSimulator } from '@/lib/ros-simulator';

let io: SocketIOServer | null = null;

export async function GET(req: NextRequest) {
  if (!io) {
    // @ts-ignore - Next.js internal server
    const httpServer: HTTPServer = (req as any).socket?.server;
    
    if (httpServer) {
      io = new SocketIOServer(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      const simulator = getSimulator();

      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Send telemetry updates
        const unsubscribe = simulator.subscribe((telemetry) => {
          socket.emit('telemetry', telemetry);
        });

        // Handle user join
        socket.on('user:join', (user) => {
          socket.broadcast.emit('user:joined', user);
        });

        // Handle user movement
        socket.on('user:move', ({ position, rotation }) => {
          socket.broadcast.emit('user:moved', socket.id, position, rotation);
        });

        // Handle annotations
        socket.on('annotation:add', (annotation) => {
          socket.broadcast.emit('annotation:added', annotation);
        });

        // Handle terminal commands
        socket.on('terminal:command', (command) => {
          // Simulate command execution
          setTimeout(() => {
            socket.emit('terminal:output', `Executing: ${command}`);
            
            // Mock responses
            if (command.includes('ros2 topic list')) {
              socket.emit('terminal:output', '/robot/odom');
              socket.emit('terminal:output', '/robot/cmd_vel');
              socket.emit('terminal:output', '/robot/battery_state');
            }
          }, 100);
        });

        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
          unsubscribe();
          socket.broadcast.emit('user:left', socket.id);
        });
      });
    }
  }

  return new Response('Socket.IO server is running', { status: 200 });
}

