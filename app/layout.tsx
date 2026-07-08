import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://snacky.az'),
  title: {
    default: 'Snacky - Premium Fast Food',
    template: '%s | Snacky',
  },
  description: 'Experience the best premium fast food in Azerbaijan. Gourmet burgers, sides, and drinks made with fresh, high-quality ingredients.',
  keywords: ['fast food', 'burger', 'restaurant', 'Azerbaijan', 'Baku', 'premium'],
  authors: [{ name: 'Snacky' }],
  creator: 'Snacky',
  publisher: 'Snacky',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['az_AZ', 'tr_TR'],
    url: 'https://snacky.az',
    siteName: 'Snacky',
    title: 'Snacky - Premium Fast Food',
    description: 'Experience the best premium fast food in Azerbaijan.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Snacky Premium Fast Food',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snacky - Premium Fast Food',
    description: 'Experience the best premium fast food in Azerbaijan.',
    images: ['/og-image.jpg'],
    creator: '@snacky',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${display.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
