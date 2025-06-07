'use client';

import React, { useState } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { SystemPanelProps, BatteryInfo } from './taskbar-types';
import {
  Wifi,
  Volume2,
  BatteryMedium,
  Bluetooth,
  PersonStanding,
  Plane,
  Sun,
  BatteryCharging,
  Moon,
  WifiOff,
  BluetoothOff,
} from 'lucide-react';

const SystemPanel: React.FC<SystemPanelProps> = ({
  isOpen,
  onClose,
  batteryInfo,
  onWifiConnect = () => {},
  onAudioDeviceSelect = () => {},
  onVolumeChange = () => {},
  className = '',
}) => {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  // Mock data - in real app this would come from props or system APIs
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(80);
  const [energySaver, setEnergySaver] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [isNightLightSpinning, setIsNightLightSpinning] = useState(false);
  const [isWifiAnimating, setIsWifiAnimating] = useState(false);
  const [isAirplaneFlyingOut, setIsAirplaneFlyingOut] = useState(false);
  const [isBluetoothAnimating, setIsBluetoothAnimating] = useState(false);

  const defaultBatteryInfo: BatteryInfo = {
    percentage: 56,
    isCharging: false,
    timeRemaining: '6h 30m',
    powerMode: 'balanced',
  };

  const currentBatteryInfo = batteryInfo || defaultBatteryInfo;

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  const handleBrightnessChange = (values: number[]) => {
    setBrightness(values[0]);
  };

  const handleButtonClick = (actionId: string, originalAction: () => void) => {
    setClickedButton(actionId);
    originalAction();

    // Reset animation after a short delay
    setTimeout(() => {
      setClickedButton(null);
    }, 200);
  };

  const handleNightLightClick = () => {
    setClickedButton('night');
    setIsNightLightSpinning(true);

    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      setIsNightLightSpinning(false);
      setClickedButton(null);
    }, 150); // Halfway through the 400ms animation
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
    }, 400); // Shorter animation duration
  };

  const quickActions = [
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
      icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />,
      label: 'Night light',
      isActive: theme === 'dark',
      onClick: handleNightLightClick,
    },
    {
      id: 'accessibility',
      icon: <PersonStanding size={20} />,
      label: 'Accessibility',
      isActive: accessibility,
      onClick: () =>
        handleButtonClick('accessibility', () =>
          setAccessibility(!accessibility)
        ),
    },
  ];

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
        <div className="px-4 pt-4">
          <div className="grid grid-cols-3 gap-2 mb-4 justify-items-stretch">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="flex flex-col items-center space-y-1"
              >
                <button
                  onClick={action.onClick}
                  className="relative p-3 rounded-md transition-all duration-200 flex items-center justify-center hover:scale-[1.02] active:scale-95 w-full"
                  style={{
                    backgroundColor: action.isActive
                      ? '#0078d4'
                      : currentTheme.glass.cardBackground,
                    color: action.isActive
                      ? '#ffffff'
                      : currentTheme.text.primary,
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
                        className="transition-transform duration-300 ease-in-out"
                        style={{
                          transform: isNightLightSpinning
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                        }}
                      >
                        {action.icon}
                      </div>
                    ) : action.id === 'wifi' ? (
                      <div
                        className="transition-all duration-200 ease-in-out"
                        style={{
                          opacity: isWifiAnimating ? 0.3 : 1,
                          transform: isWifiAnimating
                            ? 'scale(0.8)'
                            : 'scale(1)',
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
        {/* Divider */}
        <div className="border-b border-gray-600 mb-4"></div>

        <div className="px-4">
          {/* Brightness Slider */}
          <div className="mb-4">
            <div className="flex items-center space-x-3 py-2">
              <Sun
                size={18}
                style={{
                  color: currentTheme.text.primary,
                  opacity: 0.8,
                }}
              />
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
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

          {/* Volume Slider */}
          <div className="mb-4">
            <div className="flex items-center space-x-3 py-2">
              <Volume2
                size={18}
                style={{
                  color: currentTheme.text.primary,
                  opacity: 0.8,
                }}
              />
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseInt(e.target.value);
                    setVolume(newVolume);
                    onVolumeChange(newVolume);
                  }}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${
                      currentTheme.text.primary
                    } 0%, ${currentTheme.text.primary} ${volume}%, rgba(${
                      theme === 'dark' ? '255,255,255' : '0,0,0'
                    },0.3) ${volume}%, rgba(${
                      theme === 'dark' ? '255,255,255' : '0,0,0'
                    },0.3) 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-600"></div>

        <div
          className="px-4 py-2"
          style={{ background: currentTheme.glass.backgroundDark }}
        >
          {/* Battery Section */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <BatteryMedium
                size={18}
                style={{
                  color: currentTheme.text.primary,
                  opacity: 0.8,
                }}
              />
              <span
                className="text-xs font-medium"
                style={{
                  color: currentTheme.text.primary,
                }}
              >
                {currentBatteryInfo.percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemPanel;
