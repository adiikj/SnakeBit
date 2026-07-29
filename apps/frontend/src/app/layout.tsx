import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SnakeBit',
  description: 'An Interactive Snake Game',
  icons: {
    icon: '/Graphics/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
