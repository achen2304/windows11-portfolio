'use client';

import React from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { FileText, Calculator, Image, Settings } from 'lucide-react';

export const NotepadApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: currentTheme.background }}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <FileText size={20} style={{ color: currentTheme.text.primary }} />
          <h3
            className="font-semibold"
            style={{ color: currentTheme.text.primary }}
          >
            Notepad
          </h3>
        </div>
        <textarea
          className="w-full h-full resize-none border-none outline-none p-2 rounded"
          style={{
            background: currentTheme.glass.cardBackground,
            color: currentTheme.text.primary,
            border: `1px solid ${currentTheme.glass.border}`,
          }}
          placeholder="Start typing..."
          defaultValue="This is a sample notepad application running in a window.

You can:
- Type and edit text
- Drag the window around
- Resize it
- Minimize/maximize it
- Open multiple instances"
        />
      </div>
    </div>
  );
};

export const CalculatorApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const [display, setDisplay] = React.useState('0');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
    } else if (value === '=') {
      try {
        setDisplay(eval(display).toString());
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay((prev) => (prev === '0' ? value : prev + value));
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <div
      className="h-full flex flex-col p-4"
      style={{ background: currentTheme.background }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Calculator size={20} style={{ color: currentTheme.text.primary }} />
        <h3
          className="font-semibold"
          style={{ color: currentTheme.text.primary }}
        >
          Calculator
        </h3>
      </div>

      <div className="flex-1 flex flex-col space-y-2">
        <div
          className="p-4 text-right text-2xl font-mono rounded"
          style={{
            background: currentTheme.glass.cardBackground,
            color: currentTheme.text.primary,
            border: `1px solid ${currentTheme.glass.border}`,
          }}
        >
          {display}
        </div>

        <div className="grid grid-cols-4 gap-2 flex-1">
          {buttons.flat().map((btn, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(btn)}
              className="rounded font-semibold transition-all duration-150 hover:scale-105"
              style={{
                background: currentTheme.glass.cardBackground,
                color: currentTheme.text.primary,
                border: `1px solid ${currentTheme.glass.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = currentTheme.glass.cardHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  currentTheme.glass.cardBackground;
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ImageViewerApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: currentTheme.background }}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Image size={20} style={{ color: currentTheme.text.primary }} />
          <h3
            className="font-semibold"
            style={{ color: currentTheme.text.primary }}
          >
            Image Viewer
          </h3>
        </div>

        <div
          className="w-full h-full rounded flex items-center justify-center"
          style={{
            background: currentTheme.glass.cardBackground,
            border: `1px solid ${currentTheme.glass.border}`,
          }}
        >
          <div className="text-center">
            <Image
              size={64}
              style={{ color: currentTheme.text.muted }}
              className="mx-auto mb-4"
            />
            <p style={{ color: currentTheme.text.secondary }}>
              No image selected
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: currentTheme.text.muted }}
            >
              This is a sample image viewer application
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: currentTheme.background }}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Settings size={20} style={{ color: currentTheme.text.primary }} />
          <h3
            className="font-semibold"
            style={{ color: currentTheme.text.primary }}
          >
            Settings
          </h3>
        </div>

        <div className="space-y-4">
          {['Display', 'Sound', 'Network', 'Privacy', 'Updates'].map(
            (setting) => (
              <div
                key={setting}
                className="p-3 rounded cursor-pointer transition-all duration-150"
                style={{
                  background: currentTheme.glass.cardBackground,
                  border: `1px solid ${currentTheme.glass.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    currentTheme.glass.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    currentTheme.glass.cardBackground;
                }}
              >
                <h4
                  className="font-medium"
                  style={{ color: currentTheme.text.primary }}
                >
                  {setting}
                </h4>
                <p
                  className="text-sm mt-1"
                  style={{ color: currentTheme.text.secondary }}
                >
                  Configure {setting.toLowerCase()} settings
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
