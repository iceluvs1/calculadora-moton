import type { Metadata, Viewport } from 'next';

import { PwaRegistration } from './pwa-registration';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://iceluvs1.github.io/calculadora-moton/'),
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
  alternates: { canonical: 'https://iceluvs1.github.io/calculadora-moton/' },
  openGraph: {
    title: 'Calculadora de motón',
    description: 'Peso mínimo del gancho, en segundos',
    type: 'website',
    locale: 'es_CL',
    url: 'https://iceluvs1.github.io/calculadora-moton/',
    siteName: 'Calculadora de motón',
    images: [
      {
        url: 'https://iceluvs1.github.io/calculadora-moton/og-industrial.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Calculadora de motón: diseño industrial con un motón Liebherr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de motón',
    description: 'Peso mínimo del gancho, en segundos',
    images: [{
      url: 'https://iceluvs1.github.io/calculadora-moton/og-industrial.jpg',
      alt: 'Calculadora de motón: diseño industrial con un motón Liebherr',
    }],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
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
        <link rel="icon" href="./favicon-industrial.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="./apple-touch-icon-industrial.png" sizes="180x180" />
      </head>
      <body className="antialiased">
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
