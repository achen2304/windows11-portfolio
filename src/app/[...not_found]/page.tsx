'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import Link from 'next/link';

export default function NotFoundCatchAll() {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: currentTheme.background }}
    >
      <div
        className="text-center p-8 rounded-lg backdrop-blur-lg"
        style={{
          background: currentTheme.glass.background,
          border: `1px solid ${currentTheme.glass.border}`,
        }}
      >
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: currentTheme.text.primary }}
        >
          404 - Page Not Found
        </h1>
        <p
          className="text-lg mb-6"
          style={{ color: currentTheme.text.secondary }}
        >
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-md text-white inline-block"
          style={{
            backgroundColor: '#0078d4',
          }}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
