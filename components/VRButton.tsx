'use client';

import { useEffect, useState } from 'react';

export function VRButton() {
  const [isVRSupported, setIsVRSupported] = useState(false);

  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        setIsVRSupported(supported);
      });
    }
  }, []);

  const enterVR = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor', 'hand-tracking'],
        optionalFeatures: ['bounded-floor']
      });
      
      // Session will be handled by @react-three/xr
    } catch (err) {
      console.error('Failed to start VR session:', err);
    }
  };

  if (!isVRSupported) return null;

  return (
    <button
      onClick={enterVR}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 10000,
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      🥽 Enter VR
    </button>
  );
}

