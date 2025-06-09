'use client';

import React from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';

const VSCodeApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  const githubRepoUrl = 'https://github1s.com/achen2304/windows11-portfolio';

  return (
    <div
      className="h-full flex flex-col min-h-0"
      style={{ background: currentTheme.background }}
    >
      <div className="flex-1 overflow-hidden">
        <iframe
          src={githubRepoUrl}
          title="VS Code Editor"
          className="w-full h-full border-none"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
};

export default VSCodeApp;
