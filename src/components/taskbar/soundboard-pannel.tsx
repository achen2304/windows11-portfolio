'use client';

import React from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { SoundboardPanelProps } from './taskbar-types';
import Image from 'next/image';
import { sounds } from '@/data/sounds';
import { useClickSound } from '../click-sound-provider';

const SoundboardPanel: React.FC<SoundboardPanelProps> = ({
  isOpen,
  className = '',
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { playSoundById } = useClickSound();

  return (
    <div
      className="fixed bottom-14 right-39 z-[200]"
      style={{
        visibility: isOpen ? 'visible' : 'hidden',
      }}
    >
      <div
        className={`rounded-md backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${className}`}
        style={{
          background:
            theme === 'dark'
              ? 'rgba(32, 32, 32, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
          border: `1px solid ${currentTheme.glass.border}`,
          WebkitBackdropFilter: 'blur(30px)',
          transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Small header */}
        <div
          className="py-1 text-center"
          style={{
            background: currentTheme.glass.backgroundDark,
            borderBottom: `1px solid ${currentTheme.divider}`,
          }}
        >
          <span
            className="text-xs font-medium"
            style={{
              color: currentTheme.text.secondary,
            }}
          >
            sound on :)
          </span>
        </div>

        {/* Soundboard Grid */}
        <div className="p-0.5">
          <div className="grid grid-cols-4 gap-1">
            {sounds.map((sound) => (
              <button
                key={sound.name}
                onClick={() => playSoundById(sound.soundUrl)}
                className="flex flex-col items-center justify-center p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  background: 'transparent',
                }}
              >
                <div className="w-7 h-7 relative">
                  <Image
                    src={sound.imgUrl}
                    alt={sound.name}
                    fill
                    className="object-contain rounded-sm"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundboardPanel;
