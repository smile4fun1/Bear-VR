'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Failed to Load VR Scene</h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '1rem', maxWidth: '600px' }}>
            {this.state.error?.message || 'Unknown error occurred'}
          </p>
          <details style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem', maxWidth: '600px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Error Details</summary>
            <pre style={{ textAlign: 'left', overflow: 'auto', padding: '1rem', background: '#1e293b', borderRadius: '4px' }}>
              {this.state.error?.stack}
            </pre>
          </details>
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
      );
    }

    return this.props.children;
  }
}

