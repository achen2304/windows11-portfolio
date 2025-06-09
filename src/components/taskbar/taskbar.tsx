'use client';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { TaskbarProps, PanelType } from './taskbar-types';
import { useWindowManager } from '../webpage/window-manager';
import { handleAppClick } from '@/lib/window-utils';
import {
  Wifi,
  Volume2,
  ChevronUp,
  Sun,
  Moon,
  BatteryMedium,
} from 'lucide-react';
import Image from 'next/image';

interface TaskbarComponentProps extends TaskbarProps {
  onSystemTrayClick?: () => void;
  onDateTimeClick?: () => void;
  onSoundboardClick?: () => void;
  activePanels?: Set<PanelType>;
}

const Taskbar: React.FC<TaskbarComponentProps> = ({
  apps = [],
  onAppClick = () => {},
  onStartClick = () => {},
  onSystemTrayClick = () => {},
  onDateTimeClick = () => {},
  onSoundboardClick = () => {},
  activePanels = new Set(),
  className = '',
}) => {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [clickedApp, setClickedApp] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(moment());
  const [isSpinning, setIsSpinning] = useState(false);
  const { windows, focusWindow, minimizeWindow } = useWindowManager();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      setIsSpinning(false);
    }, 150); // Halfway through the 400ms animation
  };

  // Reusable hover methods
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor =
      theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const isSystemPanelActive = activePanels.has('system');
  const isCalendarPanelActive = activePanels.has('calendar');
  const isSoundboardPanelActive = activePanels.has('soundboard');

  // No need for appsWithActiveState - we'll check window state directly

  // Handle app click - focus if open, otherwise call onAppClick
  const handleTaskbarAppClick = (appId: string) => {
    // Add click animation
    setClickedApp(appId);
    setTimeout(() => setClickedApp(null), 150);

    // Use the centralized utility function
    handleAppClick(appId, windows, focusWindow, minimizeWindow, onAppClick);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[300] backdrop-blur-md ${className}`}
      style={{
        height: '48px',
        background:
          theme === 'dark'
            ? 'rgba(31, 31, 31, 0.9)'
            : 'rgba(243, 243, 243, 0.9)',
        borderTop: `1px solid ${currentTheme.glass.border}`,
        WebkitBackdropFilter: 'blur(20px)',
        pointerEvents: 'auto',
      }}
    >
      <div className="flex items-center justify-between h-full px-2">
        {/* Left side - Start button and apps */}
        <div className="flex items-center h-full">
          {/* Start Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartClick();
            }}
            className="flex items-center justify-center w-10 h-10 mx-1 rounded transition-colors duration-200 cursor-pointer"
            style={{
              backgroundColor: activePanels.has('start')
                ? theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.15)'
                : 'transparent',
              color: currentTheme.text.primary,
              pointerEvents: 'auto',
            }}
            onMouseEnter={
              !activePanels.has('start') ? handleMouseEnter : undefined
            }
            onMouseLeave={
              !activePanels.has('start') ? handleMouseLeave : undefined
            }
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </div>
          </button>

          {/* App Icons - Hide on small screens */}
          <div className="hidden sm:flex items-center ml-2 space-x-1">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTaskbarAppClick(app.id);
                }}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                className="relative flex items-center justify-center w-12 h-12 rounded transition-all duration-200 cursor-pointer"
                title={app.name}
                style={{
                  backgroundColor:
                    hoveredApp === app.id
                      ? theme === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)'
                      : 'transparent',
                  pointerEvents: 'auto',
                }}
              >
                <Image
                  src={
                    theme === 'dark' && app.iconLight !== undefined
                      ? app.icon || '/app icons/quick links/default.svg'
                      : app.iconLight ||
                        app.icon ||
                        '/app icons/quick links/default.svg'
                  }
                  alt={app.name}
                  className="w-8 h-8 object-contain pointer-events-none transition-transform duration-150 ease-out"
                  width={32}
                  height={32}
                  style={{
                    transform:
                      clickedApp === app.id ? 'scale(0.9)' : 'scale(1)',
                  }}
                />

                {/* Window state indicators */}
                {(() => {
                  // Find window that starts with the app ID (to handle unique window IDs)
                  const openWindow = windows.find((window) =>
                    window.id.startsWith(app.id)
                  );
                  const hasOpenWindow = !!openWindow;
                  const isWindowActive =
                    openWindow?.isActive && !openWindow?.isMinimized;

                  if (isWindowActive) {
                    // Active/focused window - longer line at bottom (like Edge in your image)
                    return (
                      <div
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 rounded-full pointer-events-none transition-all duration-300 ease-out"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#ffffff' : '#000000',
                          width: '24px',
                          height: '3px',
                        }}
                      />
                    );
                  } else if (hasOpenWindow) {
                    // Open but not active/focused - small dot at bottom (like other apps in your image)
                    return (
                      <div
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 rounded-full pointer-events-none transition-all duration-300 ease-out"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#ffffff' : '#000000',
                          width: '6px',
                          height: '6px',
                        }}
                      />
                    );
                  }
                  // No indicator for pinned but not open apps (like the second Edge in your image)
                  return null;
                })()}
              </button>
            ))}
          </div>
        </div>

        {/* Right side - System tray */}
        <div className="flex items-center h-full">
          {/* Soundboard button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSoundboardClick();
            }}
            className="flex items-center justify-center w-10 h-10 rounded transition-colors duration-200 cursor-pointer"
            style={{
              backgroundColor: isSoundboardPanelActive
                ? theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.15)'
                : 'transparent',
              color: currentTheme.text.primary,
              pointerEvents: 'auto',
            }}
            onMouseEnter={
              !isSoundboardPanelActive ? handleMouseEnter : undefined
            }
            onMouseLeave={
              !isSoundboardPanelActive ? handleMouseLeave : undefined
            }
            title="Soundboard"
          >
            <ChevronUp size={14} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleTheme();
            }}
            className="flex items-center justify-center w-10 h-10 mx-1 rounded transition-colors duration-200 cursor-pointer"
            style={{
              color: currentTheme.text.primary,
              pointerEvents: 'auto',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div
              className="transition-transform duration-300 ease-in-out pointer-events-none"
              style={{
                transform: isSpinning ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </div>
          </button>

          {/* Combined System Icons Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSystemTrayClick();
            }}
            className="flex items-center space-x-2 px-2 py-2 mx-1 rounded transition-colors duration-200 w-20 h-10 cursor-pointer"
            style={{
              backgroundColor: isSystemPanelActive
                ? theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.15)'
                : 'transparent',
              color: currentTheme.text.primary,
              pointerEvents: 'auto',
            }}
            onMouseEnter={!isSystemPanelActive ? handleMouseEnter : undefined}
            onMouseLeave={!isSystemPanelActive ? handleMouseLeave : undefined}
          >
            <Wifi size={16} className="pointer-events-none" />
            <Volume2 size={16} className="pointer-events-none" />
            <BatteryMedium size={16} className="pointer-events-none" />
          </button>

          {/* Date and Time */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDateTimeClick();
            }}
            className="flex flex-col items-end justify-center px-3 py-1 rounded transition-colors duration-200 min-w-[80px] h-10 cursor-pointer"
            style={{
              backgroundColor: isCalendarPanelActive
                ? theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.15)'
                : 'transparent',
              color: currentTheme.text.primary,
              pointerEvents: 'auto',
            }}
            onMouseEnter={!isCalendarPanelActive ? handleMouseEnter : undefined}
            onMouseLeave={!isCalendarPanelActive ? handleMouseLeave : undefined}
          >
            <span className="text-sm font-medium leading-tight pointer-events-none">
              {currentTime.format('h:mm A')}
            </span>
            <span
              className="text-xs leading-tight pointer-events-none"
              style={{ color: currentTheme.text.secondary }}
            >
              {currentTime.format('M/D/YYYY')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
