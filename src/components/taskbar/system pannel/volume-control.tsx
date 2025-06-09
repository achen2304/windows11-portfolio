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

  // Volume change handler with visual feedback and test sound
  const handleVolumeChange = (newVolume: number) => {
    // Update local temporary volume state while dragging
    setTempVolume(newVolume);

    // Update the system volume immediately (visual update)
    onVolumeChange(newVolume);

    // Only apply the actual volume when done dragging
    if (!isDraggingVolume) {
      applyVolumeChange(newVolume);
    }
  };

  // Apply volume change and play test sound
  const applyVolumeChange = (newVolume: number) => {
    // Update actual volume state
    setVolumeState(newVolume);

    // Update the click sound volume
    try {
      setVolume(newVolume);

      // Play a test sound when volume changes and sound is enabled
      if (soundEnabled && newVolume > 0) {
        // Play with a slight delay to ensure volume was updated
        setTimeout(() => {
          playTestSound();
        }, 30);
      }
    } catch (error) {
      console.error('Error setting click sound volume:', error);
    }

    // Visual feedback - flash the sound icon if sound is enabled
    if (soundEnabled && newVolume > 0) {
      setClickedButton('volume-feedback');
      setTimeout(() => {
        setClickedButton(null);
      }, 100);
    }
  };

  // Handle start of volume slider drag
  const handleVolumeSliderStart = () => {
    setIsDraggingVolume(true);
  };

  // Handle end of volume slider drag
  const handleVolumeSliderEnd = () => {
    setIsDraggingVolume(false);
    // Apply the final volume value
    applyVolumeChange(tempVolume);
  };

  // Toggle mute/unmute when clicking the volume icon
  const handleVolumeIconClick = () => {
    // If volume is currently 0, restore to previous non-zero volume or default to 50
    if (tempVolume === 0) {
      const newVolume = volume > 0 ? volume : 30;
      setTempVolume(newVolume);
      applyVolumeChange(newVolume);
    } else {
      // If volume is not 0, save current volume and set to 0
      setTempVolume(0);
      applyVolumeChange(0);
    }

    // Visual feedback
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
