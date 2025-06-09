'use client';

import React from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';

const GoogleApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div
      className="h-full flex flex-col min-h-0"
      style={{ background: currentTheme.background }}
    >
      <div className="flex-1 overflow-hidden">
        <iframe
          src="https://www.google.com/webhp?igu=1"
          title="Google"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

export default GoogleApp;
