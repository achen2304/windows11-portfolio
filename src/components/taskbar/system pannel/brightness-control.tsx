'use client';

import { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

// Define theme type to match theme-provider
type Theme = 'dark' | 'light';

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
  onThemeChange: (theme: Theme) => void;
  onBrightnessChange?: (brightness: number) => void;
  triggerNightLightAnimation?: () => void;
}

const BrightnessControl = ({
  initialBrightness,
  theme,
  currentTheme,
  onThemeChange,
  onBrightnessChange,
  triggerNightLightAnimation,
}: BrightnessControlProps) => {
  const [brightness, setBrightness] = useState(initialBrightness);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  // Update brightness when theme changes from outside this component
  useEffect(() => {
    // Update brightness to match current theme (without triggering theme change again)
    setBrightness(theme === 'dark' ? 38 : 65);
  }, [theme]);

  // Handle brightness change
  const handleBrightnessChange = (newBrightness: number) => {
    // Check if we're crossing the theme threshold
    const themeThreshold = 50;
    const wasDarkTheme = brightness < themeThreshold;
    const willBeDarkTheme = newBrightness < themeThreshold;

    // Detect threshold crossing
    const crossingThreshold = wasDarkTheme !== willBeDarkTheme;

    // Update brightness state
    setBrightness(newBrightness);

    // Notify parent of brightness change if callback provided
    if (onBrightnessChange) {
      onBrightnessChange(newBrightness);
    }

    // Apply theme change immediately for a more responsive experience
    if (crossingThreshold) {
      // Apply theme change
      applyBrightnessChange(newBrightness);
    }
  };

  // Apply brightness change and update theme if needed
  const applyBrightnessChange = (newBrightness: number) => {
    // Theme transition threshold - below 50 is dark, above 50 is light
    const themeThreshold = 50;

    // Determine if we should change the theme
    const shouldBeDarkTheme = newBrightness < themeThreshold;
    const currentIsDarkTheme = theme === 'dark';

    // Change theme if needed
    if (shouldBeDarkTheme !== currentIsDarkTheme) {
      // Trigger the night light animation if available
      if (triggerNightLightAnimation) {
        triggerNightLightAnimation();
      }

      // Apply the theme change
      onThemeChange(shouldBeDarkTheme ? 'dark' : 'light');
    }
  };

  // Toggle between light and dark theme when clicking the brightness icon
  const handleBrightnessIconClick = () => {
    // Toggle the theme
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const newBrightness = newTheme === 'dark' ? 38 : 65;

    // Trigger the night light animation if available
    if (triggerNightLightAnimation) {
      triggerNightLightAnimation();
    }

    // Visual feedback for button click
    setClickedButton('brightness-icon');
    setTimeout(() => {
      setClickedButton(null);
    }, 200);

    // Update the theme and brightness
    onThemeChange(newTheme as Theme);
    setBrightness(newBrightness);
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
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
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
