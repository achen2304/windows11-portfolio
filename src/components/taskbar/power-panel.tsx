'use client';

import React, { useState } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';

export interface PowerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const PowerPanel: React.FC<PowerPanelProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [shutdownMessage, setShutdownMessage] = useState('');
  const [dots, setDots] = useState('');

  if (!isOpen && !isShuttingDown && !isRestarting) return null;

  const handleShutdown = () => {
    setIsShuttingDown(true);
    setShutdownMessage('Shutting down');

    // Clear all localStorage
    localStorage.clear();

    // Animate dots
    let count = 0;
    const dotsInterval = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, 500);

    // Show animation for 2 seconds before reload
    setTimeout(() => {
      clearInterval(dotsInterval);
      window.location.reload();
    }, 2000);
  };

  const handleRestart = () => {
    setIsRestarting(true);
    setShutdownMessage('Restarting');

    // Clear all localStorage
    localStorage.clear();

    // Animate dots
    let count = 0;
    const dotsInterval = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, 500);

    // Show animation for 2 seconds before reload
    setTimeout(() => {
      clearInterval(dotsInterval);
      window.location.reload();
    }, 2000);
  };

  // If shutting down or restarting, show the animation screen
  if (isShuttingDown || isRestarting) {
    return (
      <div
        className="fixed inset-0 z-[750] flex flex-col items-center justify-center"
        style={{
          backgroundColor: theme === 'dark' ? '#121212' : '#2d2d2d',
          color: 'white',
        }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <div className="dots-circle-loader">
              <style jsx>{`
                .dots-circle-loader {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                .dot {
                  width: 12px;
                  height: 12px;
                  background-color: white;
                  border-radius: 50%;
                  margin: 0 8px;
                  opacity: 0;
                  animation: dot-animation 2s infinite;
                }

                .dot:nth-child(1) {
                  animation-delay: 0s;
                }

                .dot:nth-child(2) {
                  animation-delay: 0.4s;
                }

                .dot:nth-child(3) {
                  animation-delay: 0.8s;
                }

                .dot:nth-child(4) {
                  animation-delay: 1.2s;
                }

                .dot:nth-child(5) {
                  animation-delay: 1.6s;
                }

                @keyframes dot-animation {
                  0%,
                  100% {
                    opacity: 0;
                  }
                  50% {
                    opacity: 1;
                  }
                }
              `}</style>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          <div className="text-xl font-light mb-2">
            {shutdownMessage}
            {dots}
          </div>
          <div className="text-sm text-white/70">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-28 left-104 z-[210]"
      style={{
        visibility: isOpen ? 'visible' : 'hidden',
      }}
    >
      <div
        className={`rounded-md backdrop-blur-xl overflow-hidden transition-all duration-200 ease-out ${className}`}
        style={{
          background:
            theme === 'dark'
              ? 'rgba(32, 32, 32, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${currentTheme.glass.border}`,
          WebkitBackdropFilter: 'blur(30px)',
          transform: isOpen
            ? 'translateY(0) scale(1)'
            : 'translateY(10px) scale(0.95)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transformOrigin: 'bottom right',
        }}
      >
        <div className="flex flex-col items-center">
          <button
            onClick={handleShutdown}
            className="flex items-center justify-center px-5 py-2 transition-all duration-200 w-full text-center hover:bg-opacity-10"
            style={{
              backgroundColor: 'transparent',
              color: currentTheme.text.primary,
              width: '120px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="text-sm font-medium">Shut down</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center px-5 py-2 transition-all duration-200 w-full text-center hover:bg-opacity-10"
            style={{
              backgroundColor: 'transparent',
              color: currentTheme.text.primary,
              width: '120px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="text-sm font-medium">Restart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PowerPanel;
