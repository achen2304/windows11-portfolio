import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { ClickSoundProvider } from '@/components/click-sound-provider';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@/components/analytics';
import {
  generatePersonStructuredData,
  generateWebsiteStructuredData,
} from '@/lib/seo-utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Cai Chen - Full-Stack Software Engineer | Windows 11 Portfolio',
    template: '%s | Cai Chen - Software Engineer',
  },
  description:
    'Cai Chen is a passionate full-stack software engineer specializing in React, Next.js, TypeScript, Node.js, and modern web development. Explore my interactive Windows 11-inspired portfolio showcasing projects, skills, and experience.',
  keywords: [
    'Cai Chen',
    'Andy Chen',
    'software engineer',
    'full-stack developer',
    'React developer',
    'Next.js developer',
    'TypeScript developer',
    'Node.js developer',
    'portfolio',
    'Windows 11 portfolio',
    'Windows UI portfolio',
    'UI portfolio',
    'modern web development',
  ],
  authors: [{ name: 'Cai Chen' }],
  creator: 'Cai Chen',
  publisher: 'Cai Chen',
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
    url: 'https://caichen.dev',
    siteName: 'Cai Chen Portfolio',
    title:
      'Cai Chen - Full-Stack Software Engineer | Interactive Windows 11 Portfolio',
    description:
      "Explore Cai Chen's interactive Windows 11-inspired portfolio. A passionate full-stack software engineer showcasing expertise in React, Next.js, TypeScript, Node.js, and modern web development.",
    images: [
      {
        url: '/other/readme-banner.webp',
        width: 1200,
        height: 630,
        alt: 'Cai Chen - Windows 11 Portfolio Preview',
      },
      {
        url: '/other/profile.webp',
        width: 400,
        height: 400,
        alt: 'Cai Chen - Profile Photo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cai Chen - Full-Stack Software Engineer | Windows 11 Portfolio',
    description:
      'Interactive Windows 11-inspired portfolio showcasing full-stack development skills in React, Next.js, TypeScript, and modern web technologies.',
    images: ['/other/readme-banner.webp'],
    creator: '@caichen',
  },
  metadataBase: new URL('https://caichen.dev'),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://caichen.dev',
  },
  category: 'technology',
  classification: 'portfolio',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Cai Chen Portfolio',
    'application-name': 'Cai Chen Portfolio',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              generatePersonStructuredData(),
              generateWebsiteStructuredData(),
            ]),
          }}
        />

        <meta name="format-detection" content="telephone=no" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="color-scheme" content="dark light" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/window.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/window.svg" />
        <link rel="manifest" href="/manifest.json" />

        <Analytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark">
          <ClickSoundProvider>
            <ToastProvider>{children}</ToastProvider>
            <Toaster position="top-right" />
          </ClickSoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
