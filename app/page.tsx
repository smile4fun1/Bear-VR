'use client';

import dynamic from 'next/dynamic';

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
  return <VRScene />;
}

