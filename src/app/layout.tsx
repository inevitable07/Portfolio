import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creative Developer — Portfolio',
  description: 'Bridging design and engineering. Building high-performance digital experiences.',
  openGraph: {
    title: 'Creative Developer — Portfolio',
    description: 'Bridging design and engineering.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ backgroundColor: '#121212' }}>{children}</body>
    </html>
  );
}
