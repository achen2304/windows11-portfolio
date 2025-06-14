'use client';

import React, { useState } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { Download } from 'lucide-react';
import resume from '@/data/resume';

export const WordApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const [scale, setScale] = useState<number>(1.2);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resume.location;
    link.download = resume.title;
    link.click();
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  return (
    <div
      className="h-full flex flex-col min-h-0"
      style={{
        background: theme === 'dark' ? currentTheme.surface : '#ffffff',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
          background:
            theme === 'dark' ? currentTheme.glass.background : '#f9f9f9',
        }}
      >
        <div
          className="font-medium"
          style={{
            color: theme === 'dark' ? currentTheme.text.primary : '#111111',
          }}
        >
          {resume.title}
        </div>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors"
          style={{
            background:
              theme === 'dark' ? currentTheme.button.background : '#f3f4f6',
            color: theme === 'dark' ? currentTheme.text.primary : '#111111',
            borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
          }}
          onClick={handleDownload}
        >
          <Download size={16} />
          <span className="text-sm">Download</span>
        </button>
      </div>

      {/* Zoom Controls */}
      {/* <div
        className="flex items-center justify-end px-4 py-1 border-b"
        style={{
          borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
          background:
            theme === 'dark' ? currentTheme.glass.background : '#f9f9f9',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded text-sm"
            onClick={zoomOut}
            style={{
              background:
                theme === 'dark' ? currentTheme.button.background : '#f3f4f6',
              color: theme === 'dark' ? currentTheme.text.primary : '#111111',
            }}
          >
            -
          </button>
          <span
            style={{
              color: theme === 'dark' ? currentTheme.text.primary : '#111111',
            }}
          >
            {Math.round(scale * 100)}%
          </span>
          <button
            className="px-2 py-1 rounded text-sm"
            onClick={zoomIn}
            style={{
              background:
                theme === 'dark' ? currentTheme.button.background : '#f3f4f6',
              color: theme === 'dark' ? currentTheme.text.primary : '#111111',
            }}
          >
            +
          </button>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex justify-center items-center">
        <h1 className="w-full h-full text-center mt-10">
          Resume is under construction, check back in August 2025.
        </h1>
        {/* <iframe
          src={resume.location}
          className="w-full h-full"
          style={{ border: 'none' }}
        ></iframe> */}
      </div>
    </div>
  );
};

export default WordApp;
