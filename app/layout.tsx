import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Servi VR Diagnostics',
  description: 'WebXR-based diagnostic platform for Servi robots with real-time telemetry and collaboration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

