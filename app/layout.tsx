import type { Metadata, Viewport } from 'next';

import { PwaRegistration } from './pwa-registration';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://calculadora-moton.awkwardss.chatgpt.site'),
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
  openGraph: {
    title: 'Calculadora de motón',
    description: 'Peso mínimo del gancho, en segundos',
    type: 'website',
    locale: 'es_CL',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Calculadora de motón — peso mínimo del gancho, en segundos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de motón',
    description: 'Peso mínimo del gancho, en segundos',
    images: ['/og.png'],
  },
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
      <body className="antialiased">
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
