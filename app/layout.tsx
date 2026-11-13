import type { Metadata, Viewport } from 'next';

import { PwaRegistration } from './pwa-registration';
import './globals.css';

// Nombre, descripción e imagen para navegadores y enlaces compartidos.
// GitHub Pages usa los equivalentes de github/index.html; hay que mantenerlos iguales.
export const metadata: Metadata = {
  metadataBase: new URL('https://iceluvs1.github.io/calculadora-moton/'),
  title: 'Calculadora LIEBHERR',
  description:
    'Herramienta independiente para calcular el peso del motón, la presión sobre el suelo y la superficie de apoyo necesaria.',
  applicationName: 'Calculadora LIEBHERR',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Calculadora LIEBHERR',
  },
  formatDetection: { telephone: false },
  alternates: { canonical: 'https://iceluvs1.github.io/calculadora-moton/' },
  openGraph: {
    title: 'Calculadora LIEBHERR',
    description:
      'Motón de gancho, presión sobre el suelo y superficie de apoyo.',
    type: 'website',
    locale: 'es_CL',
    url: 'https://iceluvs1.github.io/calculadora-moton/',
    siteName: 'Calculadora LIEBHERR',
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
    title: 'Calculadora LIEBHERR',
    description:
      'Motón de gancho, presión sobre el suelo y superficie de apoyo.',
    images: [
      {
        url: 'https://iceluvs1.github.io/calculadora-moton/og-industrial.jpg',
        alt: 'Calculadora de motón: diseño industrial con un motón Liebherr',
      },
    ],
  },
};

// Permite adaptar el ancho al celular y mantiene la interfaz del navegador oscura.
export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Estructura común de la versión Next/Vinext: idioma, CSS y registro de la PWA.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="./manifest.webmanifest" />
        <link
          rel="icon"
          href="./favicon-industrial.png"
          type="image/png"
          sizes="48x48"
        />
        <link
          rel="apple-touch-icon"
          href="./apple-touch-icon-industrial.png"
          sizes="180x180"
        />
      </head>
      <body className="antialiased">
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
