'use client';

import { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

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

interface BrightnessControlProps {
  initialBrightness: number;
  theme: string;
  currentTheme: ThemeObject;
  onThemeChange?: (theme: string) => void;
  onBrightnessChange?: (brightness: number) => void;
}

const BrightnessControl = ({
  initialBrightness = 100, // Set default to 100%
  theme,
  currentTheme,
  onBrightnessChange,
}: BrightnessControlProps) => {
  const [brightness, setBrightness] = useState(initialBrightness);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  // Apply brightness filter to the document body
  useEffect(() => {
    // Apply actual brightness filter to the root element
    const rootElement = document.documentElement;

    // Get current filter, extract any existing sepia/contrast (for night light)
    const currentFilter = rootElement.style.filter || '';
    const nightLightFilter = currentFilter.match(
      /(sepia\([^)]+\)|contrast\([^)]+\))/g
    );

    // Combine brightness with existing night light filter if present
    if (nightLightFilter && nightLightFilter.length) {
      rootElement.style.filter = `brightness(${
        brightness / 100
      }) ${nightLightFilter.join(' ')}`;
    } else {
      rootElement.style.filter = `brightness(${brightness / 100})`;
    }

    return () => {
      // Don't fully clean up on unmount to avoid removing night light filter
    };
  }, [brightness]);

  // Handle brightness change
  const handleBrightnessChange = (newBrightness: number) => {
    // Update brightness state
    setBrightness(newBrightness);

    // Notify parent of brightness change if callback provided
    if (onBrightnessChange) {
      onBrightnessChange(newBrightness);
    }
  };

  // Toggle between minimum and maximum brightness when clicking the brightness icon
  const handleBrightnessIconClick = () => {
    // Toggle between 40% and 100% brightness
    const newBrightness = brightness < 50 ? 100 : 40;

    // Update the brightness
    handleBrightnessChange(newBrightness);

    // Visual feedback for button click
    setClickedButton('brightness-icon');
    setTimeout(() => {
      setClickedButton(null);
    }, 200);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-3 py-2">
        <div
          onClick={handleBrightnessIconClick}
          className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{
            transform:
              clickedButton === 'brightness-icon' ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <Sun
            size={18}
            style={{
              color: currentTheme.text.primary,
              opacity: 0.8,
            }}
          />
        </div>
        <div className="flex-1 relative">
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${
                currentTheme.text.primary
              } 0%, ${currentTheme.text.primary} ${brightness}%, rgba(${
                theme === 'dark' ? '255,255,255' : '0,0,0'
              },0.3) ${brightness}%, rgba(${
                theme === 'dark' ? '255,255,255' : '0,0,0'
              },0.3) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BrightnessControl;
