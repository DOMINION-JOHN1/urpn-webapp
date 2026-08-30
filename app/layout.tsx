import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'URPN · Unique Revival Prayer Network',
  description:
    'Restoring people, families, spheres, and territories back to their original divine ordination — through prophetic intercession, fire, and the seasoned word of God.',
  keywords: ['URPN', 'Unique Revival Prayer Network', 'Revival', 'Prayer', 'Intercession', 'Restoration'],
  icons: {
    icon: '/urpn-logo.png',
    shortcut: '/urpn-logo.png',
    apple: '/urpn-logo.png',
  },
  openGraph: {
    title: 'URPN · Unique Revival Prayer Network',
    description: 'Restoring people, families, spheres, and territories back to their original ordination.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0710',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="text-cream-200 flex flex-col min-h-screen antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col items-center w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
