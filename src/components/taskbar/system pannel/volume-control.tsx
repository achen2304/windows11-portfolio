'use client';

import { useState } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { useClickSound } from '@/components/click-sound-provider';

// Define a type for the theme object
interface ThemeObject {
  text: {
    primary: string;
    secondary: string;
  };
  glass: {
    background: string;
    cardBackground: string;
    cardHover: string;
    border: string;
  };
}

interface VolumeControlProps {
  initialVolume: number;
  onVolumeChange: (volume: number) => void;
  theme: string;
  currentTheme: ThemeObject;
}

const VolumeControl = ({
  initialVolume,
  onVolumeChange,
  theme,
  currentTheme,
}: VolumeControlProps) => {
  const { soundEnabled, setVolume, playTestSound } = useClickSound();
  const [volume, setVolumeState] = useState(initialVolume);
  const [tempVolume, setTempVolume] = useState(initialVolume);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleVolumeChange = (newVolume: number) => {
    setTempVolume(newVolume);

    onVolumeChange(newVolume);

    if (!isDraggingVolume) {
      applyVolumeChange(newVolume);
    }
  };

  const applyVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);

    try {
      setVolume(newVolume);

      if (soundEnabled && newVolume > 0) {
        setTimeout(() => {
          playTestSound();
        }, 30);
      }
    } catch (error) {
      console.error('Error setting click sound volume:', error);
    }

    if (soundEnabled && newVolume > 0) {
      setClickedButton('volume-feedback');
      setTimeout(() => {
        setClickedButton(null);
      }, 100);
    }
  };

  const handleVolumeSliderStart = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeSliderEnd = () => {
    setIsDraggingVolume(false);
    applyVolumeChange(tempVolume);
  };

  const handleVolumeIconClick = () => {
    if (tempVolume === 0) {
      const newVolume = volume > 0 ? volume : 30;
      setTempVolume(newVolume);
      applyVolumeChange(newVolume);
    } else {
      setTempVolume(0);
      applyVolumeChange(0);
    }

    setClickedButton('volume-icon');
    setTimeout(() => {
      setClickedButton(null);
    }, 200);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-3 py-2">
        <div
          onClick={handleVolumeIconClick}
          className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{
            transform:
              clickedButton === 'volume-icon' ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          {tempVolume === 0 ? (
            <VolumeX
              size={18}
              style={{
                color: currentTheme.text.primary,
                opacity: 0.8,
              }}
            />
          ) : tempVolume < 50 ? (
            <Volume1
              size={18}
              style={{
                color: currentTheme.text.primary,
                opacity: 0.8,
              }}
            />
          ) : (
            <Volume2
              size={18}
              style={{
                color: currentTheme.text.primary,
                opacity: 0.8,
              }}
            />
          )}
        </div>
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={tempVolume}
            onChange={(e) => {
              const newVolume = parseInt(e.target.value);
              handleVolumeChange(newVolume);
            }}
            onMouseDown={handleVolumeSliderStart}
            onMouseUp={handleVolumeSliderEnd}
            onTouchStart={handleVolumeSliderStart}
            onTouchEnd={handleVolumeSliderEnd}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${
                currentTheme.text.primary
              } 0%, ${currentTheme.text.primary} ${tempVolume}%, rgba(${
                theme === 'dark' ? '255,255,255' : '0,0,0'
              },0.3) ${tempVolume}%, rgba(${
                theme === 'dark' ? '255,255,255' : '0,0,0'
              },0.3) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VolumeControl;
