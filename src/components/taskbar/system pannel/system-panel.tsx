'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme-provider';
import { themes } from '@/lib/themes';
import { SystemPanelProps } from '../taskbar-types';
import { useClickSound } from '../../click-sound-provider';
import QuickActions from './quick-actions';
import BrightnessControl from './brightness-control';
import VolumeControl from './volume-control';
import BatteryStatus from './battery-status';

// Define the theme type to match the theme-provider type
type Theme = 'dark' | 'light';

/**
 * System Panel component for Windows 11 style quick settings
 */
const SystemPanel: React.FC<SystemPanelProps> = ({
  isOpen,
  batteryInfo,
  onVolumeChange = () => {},
  className = '',
}) => {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { soundEnabled, toggleSound, setVolume } = useClickSound();

  // Default volume level
  const [volume, setVolumeState] = useState(30);

  // Night light animation state
  const [isNightLightSpinning, setIsNightLightSpinning] = useState(false);

  // Initialize click sound volume with system volume
  useEffect(() => {
    if (isOpen) {
      try {
        setVolume(volume);
      } catch (error) {
        console.error('Failed to set initial click volume:', error);
      }
    }
  }, [isOpen, setVolume, volume]);

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);
    onVolumeChange(newVolume);
  };

  return (
    <>
      {/* System Panel */}
      <div
        className={`fixed bottom-14 right-2 z-[200] w-80 rounded-lg backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out ${className}`}
        style={{
          background: currentTheme.glass.background,
          border: `1px solid ${currentTheme.glass.border}`,
          WebkitBackdropFilter: 'blur(30px)',
          transform: isOpen ? 'translateY(0)' : 'translateY(calc(100%))',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Custom Slider Styles */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: ${currentTheme.text.primary};
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: ${currentTheme.text.primary};
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>

        {/* Quick Actions Grid */}
        <QuickActions
          theme={theme}
          currentTheme={currentTheme}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          onThemeChange={handleThemeChange}
          isSpinning={isNightLightSpinning}
          setIsSpinning={setIsNightLightSpinning}
        />

        {/* Divider */}
        <div className="border-b border-gray-600 mb-4"></div>

        <div className="px-4">
          {/* Brightness Slider */}
          <BrightnessControl
            initialBrightness={100}
            theme={theme}
            currentTheme={currentTheme}
          />

          {/* Volume Slider */}
          <VolumeControl
            initialVolume={volume}
            onVolumeChange={handleVolumeChange}
            theme={theme}
            currentTheme={currentTheme}
          />
        </div>

        <div className="border-b border-gray-600"></div>

        {/* Battery Status */}
        {batteryInfo && (
          <BatteryStatus
            batteryInfo={batteryInfo}
            currentTheme={currentTheme}
          />
        )}
      </div>
    </>
  );
};

export default SystemPanel;
