'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const VRScene = dynamic(() => import('@/components/VRScene'), {
  ssr: false,
  loading: () => (
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
        <div>Loading Servi VR...</div>
      </div>
    </div>
  ),
});

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) {
        console.error('VRScene failed to load within 10 seconds');
      }
    }, 10000);

    setLoaded(true);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (error) {
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
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Failed to Load</div>
          <div style={{ fontSize: '1rem', color: '#94a3b8' }}>{error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '1rem 2rem',
              background: '#8b5cf6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <VRScene />;
}

