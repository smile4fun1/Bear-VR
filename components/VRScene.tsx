'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { XR } from '@react-three/xr';
import { useStore } from '@/lib/store';
import { ServiRobot } from './ServiRobot';
import { Annotations } from './Annotations';
import { MapEditor } from './MapEditor';
import { Restaurant } from './Restaurant';
import { UnifiedMenu } from './UnifiedMenu';
import { PlayerAvatar } from './PlayerAvatar';
import { VRControllers } from './VRControllers';
import { VRButton } from './VRButton';
import { ErrorBoundary } from './ErrorBoundary';
import { SimpleScene } from './SimpleScene';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { Suspense } from 'react';

function Scene() {
  const settings = useStore((state) => state.settings);
  const currentUser = useStore((state) => state.currentUser);

  // Check if we're in a VR-capable browser (Quest)
  const isQuest = typeof navigator !== 'undefined' && 
    (navigator.userAgent.includes('Quest') || navigator.userAgent.includes('OculusBrowser'));

  console.log('Is Quest Browser:', isQuest);

  // Use simplified scene for Quest to avoid performance issues
  if (isQuest) {
    return (
      <Suspense fallback={null}>
        <SimpleScene />
        <VRControllers />
      </Suspense>
    );
  }

  // Full scene for desktop
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.3} />

      <Environment preset="sunset" />

      {/* Restaurant environment */}
      <Restaurant />

      {settings.showGrid && (
        <Grid
          args={[50, 50]}
          cellSize={1}
          cellColor="#334155"
          sectionSize={5}
          sectionColor="#475569"
        />
      )}

      {settings.showAxes && <axesHelper args={[5]} />}

      <ServiRobot />
      <UnifiedMenu />
      <Annotations />
      <MapEditor />

      {/* Player avatar - NOT rendered for local user, only for others to see */}

      {/* VR Controllers */}
      <VRControllers />
    </Suspense>
  );
}

function VRSceneContent() {
  const setTelemetry = useStore((state) => state.setTelemetry);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const addTerminalLine = useStore((state) => state.addTerminalLine);
  const setConnected = useStore((state) => state.setConnected);
  const setMapData = useStore((state) => state.setMapData);
  const [canvasReady, setCanvasReady] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [useXRWrapper, setUseXRWrapper] = useState(true);

  useEffect(() => {
    console.log('VRScene mounted successfully');
    console.log('User Agent:', navigator.userAgent);
    
    // Test WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        console.log('✅ WebGL is supported');
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          console.log('GPU:', (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        }
        setWebglSupported(true);
      } else {
        console.error('❌ WebGL is NOT supported');
        setWebglSupported(false);
      }
    } catch (err) {
      console.error('Error testing WebGL:', err);
      setWebglSupported(false);
    }
    
    // Check if WebXR is available
    if ('xr' in navigator) {
      console.log('✅ WebXR is available');
      (navigator as any).xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        console.log('VR supported:', supported);
      }).catch((err: any) => console.error('Error checking VR support:', err));
    } else {
      console.warn('⚠️ WebXR not available on this device');
    }

    // Mark canvas as ready after short delay
    setTimeout(() => {
      console.log('Attempting to render Canvas...');
      setCanvasReady(true);
    }, 500);
  }, []);

  useEffect(() => {
    // Generate user ID and info
    const userId = uuidv4();
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const userColor = colors[Math.floor(Math.random() * colors.length)];
    
    const username = `User-${userId.slice(0, 4)}`;
    const role = 'controller';

    const currentUser = {
      id: userId,
      username,
      role: role as 'viewer' | 'controller',
      position: [0, 1.6, 3] as [number, number, number],
      rotation: [0, 0, 0, 1] as [number, number, number, number],
      color: userColor,
    };

    setCurrentUser(currentUser);
    setConnected(true);

    // Simple client-side simulator
    const getInitialTelemetry = () => ({
      id: 'SERVI-001',
      timestamp: Date.now(),
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      velocity: { linear: 0, angular: 0 },
      battery: { percentage: 85, voltage: 48.2, current: 2.5, temperature: 32 },
      status: { state: 'idle' as const, mode: 'autonomous' as const, errors: [], warnings: [] },
      sensors: {
        lidar: { points: 1024, range: 10 },
        cameras: { front: true, rear: true, depth: true },
        imu: { pitch: 0, roll: 0, yaw: 0 },
        encoders: { left: 0, right: 0 },
      },
      network: { connected: true, signalStrength: -45, latency: 12 },
    });

    let telemetry = getInitialTelemetry();

    const interval = setInterval(() => {
      const t = Date.now() / 5000;
      const radius = 2;
      telemetry.position.x = Math.cos(t) * radius;
      telemetry.position.y = Math.sin(t) * radius;
      telemetry.velocity.linear = 0.5 + Math.random() * 0.2;
      telemetry.battery.percentage = Math.max(20, telemetry.battery.percentage - 0.001);
      telemetry.sensors.imu.yaw = (t * 50) % 360;
      telemetry.timestamp = Date.now();
      setTelemetry({ ...telemetry });
    }, 100);

    // Initialize mock map data
    setMapData({
      id: 'map-1',
      name: 'Test Facility Floor 1',
      occupancyGrid: [],
      resolution: 0.05,
      origin: { x: -10, y: -10 },
      waypoints: [
        { id: 'wp-1', x: 2, y: 2, label: 'Kitchen' },
        { id: 'wp-2', x: -3, y: 4, label: 'Dining Area' },
        { id: 'wp-3', x: 0, y: -2, label: 'Charging Station' },
      ],
      obstacles: [
        { id: 'obs-1', x: 1, y: -1, radius: 0.5 },
        { id: 'obs-2', x: -2, y: 2, radius: 0.3 },
      ],
    });

    addTerminalLine('> Servi VR Diagnostics Ready');

    return () => clearInterval(interval);
  }, []);

  // Show WebGL error if not supported
  if (webglSupported === false) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: 'white',
        padding: '2rem',
        flexDirection: 'column',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>WebGL Not Supported</h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '500px' }}>
          Your browser doesn't support WebGL, which is required for 3D rendering.
          Please try using a different browser or device.
        </p>
      </div>
    );
  }

  // Show loading state until canvas is ready
  if (!canvasReady) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>🥽</div>
          <div>Initializing VR Scene...</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Check browser console for logs
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <VRButton />
      
      {/* Show fallback button if XR wrapper fails */}
      {!useXRWrapper && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#8b5cf6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px'
        }} onClick={() => setUseXRWrapper(true)}>
          ⚠️ XR Wrapper Disabled - Click to Re-enable
        </div>
      )}

      <Canvas
        shadows
        camera={{ position: [0, 8, 45], fov: 75 }}
        gl={{ 
          antialias: false, // Disable AA for Quest performance
          alpha: false,
          powerPreference: 'high-performance'
        }}
        onCreated={async (state) => {
          console.log('✅ Canvas created successfully');
          console.log('Renderer:', state.gl.capabilities);
          
          // Mark WebGL context as XR compatible (critical for Quest)
          try {
            state.gl.xr.enabled = true;
            console.log('✅ WebXR enabled on renderer');
            
            // Make the context XR compatible if WebXR is available
            if ('xr' in navigator && state.gl.domElement) {
              const canvas = state.gl.domElement;
              const ctx = canvas.getContext('webgl2', { xrCompatible: true }) || 
                          canvas.getContext('webgl', { xrCompatible: true });
              console.log('✅ WebGL context marked as XR compatible');
            }
          } catch (err) {
            console.error('Error enabling XR:', err);
          }
        }}
        onError={(error) => {
          console.error('❌ Canvas error:', error);
          // Disable XR wrapper on error
          setUseXRWrapper(false);
        }}
        performance={{ min: 0.5 }} // Quest optimization
        frameloop="always"
      >
        {useXRWrapper ? (
          <XR>
            <Scene />
            <OrbitControls 
              makeDefault 
              minDistance={5}
              maxDistance={100}
              enableDamping
              dampingFactor={0.05}
            />
          </XR>
        ) : (
          <>
            <Scene />
            <OrbitControls 
              makeDefault 
              minDistance={5}
              maxDistance={100}
              enableDamping
              dampingFactor={0.05}
            />
          </>
        )}
      </Canvas>
    </ErrorBoundary>
  );
}

export default function VRScene() {
  return (
    <ErrorBoundary>
      <div style={{ width: '100vw', height: '100vh', background: '#0f172a' }}>
        <VRSceneContent />
      </div>
    </ErrorBoundary>
  );
}

