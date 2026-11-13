import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: {
    default: 'URPN — Unique Revival Prayer Network',
    template: '%s · URPN',
  },
  description:
    'A prophetic prayer network restoring people, families, spheres, and territories to their original divine ordination — with training for every worker, minister, and pastor.',
  applicationName: 'URPN',
  keywords: [
    'URPN',
    'Unique Revival Prayer Network',
    'Revival',
    'Prayer',
    'Intercession',
    'Restoration',
    'Worker training',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/favicon-32.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'URPN',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'URPN — Unique Revival Prayer Network',
    description:
      'Restoring people, families, spheres, and territories to their original divine ordination.',
    type: 'website',
    siteName: 'URPN',
  },
};

export const viewport: Viewport = {
  themeColor: '#131211',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-canvas text-cream-100 antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('urpn-theme');var light=t==='light';document.documentElement.classList.toggle('light',light);document.documentElement.style.colorScheme=light?'light':'dark';var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',light?'#F7F4EE':'#131211');}catch(e){}})();`,
          }}
        />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
