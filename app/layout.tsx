import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { PwaRegistration } from './pwa-registration';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Calculadora de motón',
  description:
    'Calcula el peso mínimo requerido del motón de gancho según largo de pluma, diámetro de cable y número de ramales.',
  applicationName: 'Calculadora de motón',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Calc. motón',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#183047',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="./manifest.webmanifest" />
        <link rel="icon" href="./icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
