import { io, Socket } from 'socket.io-client';
import { ServiTelemetry, Annotation, User } from './types';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io({
      path: '/api/socket',
      addTrailingSlash: false,
    });
  }
  return socket;
}

export function initializeSocket(
  onTelemetry: (data: ServiTelemetry) => void,
  onUserJoined: (user: User) => void,
  onUserLeft: (userId: string) => void,
  onUserMoved: (userId: string, position: [number, number, number], rotation: [number, number, number, number]) => void,
  onAnnotation: (annotation: Annotation) => void,
  onTerminalOutput: (line: string) => void,
  onConnect: () => void,
  onDisconnect: () => void
) {
  const socket = getSocket();

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('telemetry', onTelemetry);
  socket.on('user:joined', onUserJoined);
  socket.on('user:left', onUserLeft);
  socket.on('user:moved', onUserMoved);
  socket.on('annotation:added', onAnnotation);
  socket.on('terminal:output', onTerminalOutput);

  return socket;
}

export function emitUserJoin(user: User) {
  const socket = getSocket();
  socket.emit('user:join', user);
}

export function emitUserMove(position: [number, number, number], rotation: [number, number, number, number]) {
  const socket = getSocket();
  socket.emit('user:move', { position, rotation });
}

export function emitAnnotation(annotation: Annotation) {
  const socket = getSocket();
  socket.emit('annotation:add', annotation);
}

export function emitTerminalCommand(command: string) {
  const socket = getSocket();
  socket.emit('terminal:command', command);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

