'use client';

import { useState, useEffect } from 'react';
import {
  Wifi,
  Bluetooth,
  Plane,
  Moon,
  BatteryCharging,
  WifiOff,
  BluetoothOff,
  Volume2,
  VolumeX,
} from 'lucide-react';

type Theme = 'dark' | 'light';

interface ThemeObject {
  text: {
    primary: string;
    secondary: string;
  };
  glass: {
    background: string;
    backgroundDark: string;
    cardBackground: string;
    cardHover: string;
    border: string;
  };
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface QuickActionsProps {
  theme: string;
  currentTheme: ThemeObject;
  soundEnabled: boolean;
  toggleSound: () => void;
  onThemeChange: (theme: Theme) => void;
  isSpinning?: boolean;
  setIsSpinning?: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuickActions = ({
  currentTheme,
  soundEnabled,
  toggleSound,
  isSpinning = false,
  setIsSpinning,
}: QuickActionsProps) => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [energySaver, setEnergySaver] = useState(false);
  const [nightLightEnabled, setNightLightEnabled] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [isWifiAnimating, setIsWifiAnimating] = useState(false);
  const [isAirplaneFlyingOut, setIsAirplaneFlyingOut] = useState(false);
  const [isBluetoothAnimating, setIsBluetoothAnimating] = useState(false);

  // Apply night light filter when enabled
  useEffect(() => {
    const rootElement = document.documentElement;
    const currentFilter = rootElement.style.filter || '';

    const brightnessFilter = currentFilter.match(/brightness\([^)]+\)/);
    const brightnessValue = brightnessFilter
      ? brightnessFilter[0]
      : 'brightness(1)';

    if (nightLightEnabled) {
      rootElement.style.filter = `${brightnessValue} sepia(20%) contrast(0.95)`;
    } else if (brightnessFilter) {
      rootElement.style.filter = brightnessValue;
    } else {
      rootElement.style.filter = '';
    }
  }, [nightLightEnabled]);

  const handleButtonClick = (actionId: string, originalAction: () => void) => {
    setClickedButton(actionId);
    originalAction();

    setTimeout(() => {
      setClickedButton(null);
    }, 200);
  };

  const handleNightLightClick = () => {
    setClickedButton('night');
    setIsSpinning?.(true);

    setTimeout(() => {
      setNightLightEnabled(!nightLightEnabled);
      setIsSpinning?.(false);
      setClickedButton(null);
    }, 200);
  };

  const handleWifiClick = () => {
    setClickedButton('wifi');
    setIsWifiAnimating(true);

    setTimeout(() => {
      setWifiEnabled(!wifiEnabled);
      setIsWifiAnimating(false);
      setClickedButton(null);
    }, 200);
  };

  const handleBluetoothClick = () => {
    setClickedButton('bluetooth');
    setIsBluetoothAnimating(true);

    setTimeout(() => {
      setBluetoothEnabled(!bluetoothEnabled);
      setIsBluetoothAnimating(false);
      setClickedButton(null);
    }, 200);
  };

  const handleAirplaneClick = () => {
    setClickedButton('airplane');
    setIsAirplaneFlyingOut(true);

    setTimeout(() => {
      setAirplaneMode(!airplaneMode);
      setIsAirplaneFlyingOut(false);
      setClickedButton(null);
    }, 400);
  };

  const handleSoundToggle = () => {
    setClickedButton('sound');
    toggleSound();

    setTimeout(() => {
      setClickedButton(null);
    }, 200);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'wifi',
      icon: wifiEnabled ? <Wifi size={20} /> : <WifiOff size={20} />,
      label: 'Wi-Fi',
      isActive: wifiEnabled,
      onClick: handleWifiClick,
    },
    {
      id: 'bluetooth',
      icon: bluetoothEnabled ? (
        <Bluetooth size={20} />
      ) : (
        <BluetoothOff size={20} />
      ),
      label: 'Bluetooth',
      isActive: bluetoothEnabled,
      onClick: handleBluetoothClick,
    },
    {
      id: 'airplane',
      icon: <Plane size={20} />,
      label: 'Airplane mode',
      isActive: airplaneMode,
      onClick: handleAirplaneClick,
    },
    {
      id: 'energy',
      icon: <BatteryCharging size={20} />,
      label: 'Energy saver',
      isActive: energySaver,
      onClick: () =>
        handleButtonClick('energy', () => setEnergySaver(!energySaver)),
    },
    {
      id: 'night',
      icon: <Moon size={20} />,
      label: 'Night light',
      isActive: nightLightEnabled,
      onClick: handleNightLightClick,
    },
    {
      id: 'sound',
      icon: soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />,
      label: 'Sound',
      isActive: soundEnabled,
      onClick: handleSoundToggle,
    },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="grid grid-cols-3 gap-2 mb-4 justify-items-stretch">
        {quickActions.map((action) => (
          <div key={action.id} className="flex flex-col items-center space-y-1">
            <button
              onClick={action.onClick}
              className="relative p-3 rounded-md transition-all duration-200 flex items-center justify-center hover:scale-[1.02] active:scale-95 w-full"
              style={{
                backgroundColor: action.isActive
                  ? '#0078d4'
                  : currentTheme.glass.cardBackground,
                color: action.isActive ? '#ffffff' : currentTheme.text.primary,
                height: '48px',
                border: action.isActive
                  ? '1px solid rgba(0, 120, 212, 0.3)'
                  : `1px solid ${currentTheme.glass.border}`,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!action.isActive) {
                  e.currentTarget.style.backgroundColor =
                    currentTheme.glass.cardHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!action.isActive) {
                  e.currentTarget.style.backgroundColor =
                    currentTheme.glass.cardBackground;
                }
              }}
            >
              <div
                style={{
                  opacity: 0.9,
                  transform:
                    clickedButton === action.id ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.2s ease-out',
                }}
              >
                {action.id === 'night' ? (
                  <div
                    className="transition-transform duration-300 ease-in-out pointer-events-none"
                    style={{
                      transform: isSpinning ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    {action.icon}
                  </div>
                ) : action.id === 'wifi' ? (
                  <div
                    className="transition-all duration-200 ease-in-out"
                    style={{
                      opacity: isWifiAnimating ? 0.3 : 1,
                      transform: isWifiAnimating ? 'scale(0.8)' : 'scale(1)',
                    }}
                  >
                    {action.icon}
                  </div>
                ) : action.id === 'bluetooth' ? (
                  <div
                    className="transition-all duration-200 ease-in-out"
                    style={{
                      opacity: isBluetoothAnimating ? 0.3 : 1,
                      transform: isBluetoothAnimating
                        ? 'scale(0.8)'
                        : 'scale(1)',
                    }}
                  >
                    {action.icon}
                  </div>
                ) : action.id === 'airplane' ? (
                  <div
                    style={{
                      transform: isAirplaneFlyingOut
                        ? 'translateX(40px) translateY(-20px) rotate(25deg) scale(0.6)'
                        : 'none',
                      opacity: isAirplaneFlyingOut ? 0 : 1,
                      transition: isAirplaneFlyingOut
                        ? 'all 400ms ease-in-out'
                        : 'opacity 150ms ease-in-out 200ms',
                    }}
                  >
                    {action.icon}
                  </div>
                ) : (
                  action.icon
                )}
              </div>
            </button>
            <div
              className="text-xs font-small leading-tight text-center p-1"
              style={{
                color: currentTheme.text.primary,
              }}
            >
              {action.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
