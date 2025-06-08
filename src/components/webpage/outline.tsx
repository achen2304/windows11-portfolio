'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Rnd } from 'react-rnd';

// Handle styles for better resize cursors
const handleStyles = {
  bottom: { cursor: 'ns-resize' },
  bottomLeft: { cursor: 'nesw-resize' },
  bottomRight: { cursor: 'nwse-resize' },
  left: { cursor: 'ew-resize' },
  right: { cursor: 'ew-resize' },
  top: { cursor: 'ns-resize' },
  topLeft: { cursor: 'nwse-resize' },
  topRight: { cursor: 'nesw-resize' },
};

interface AppOutlineProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  className?: string;
  isMaximized?: boolean;
  onMaximizeToggle?: () => void;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  isActive?: boolean;
  isOpening?: boolean;
  isClosing?: boolean;
  onOpeningAnimationEnd?: () => void;
}

const AppOutline: React.FC<AppOutlineProps> = ({
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 800, height: 600 },
  onClose,
  className = '',
  isMaximized = false,
  onMaximizeToggle,
  style,
  onFocus,
  onPositionChange,
  onSizeChange,
  isActive,
  isOpening = false,
  isClosing = false,
  onOpeningAnimationEnd,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  // Ensure initial size doesn't exceed viewport
  const constrainedInitialSize = {
    width: Math.min(initialSize.width, window.innerWidth - 40),
    height: Math.min(initialSize.height, window.innerHeight - 88), // Account for taskbar
  };

  // Ensure initial position is within viewport
  const constrainedInitialPosition = {
    x: Math.min(
      Math.max(0, initialPosition.x),
      window.innerWidth - constrainedInitialSize.width
    ),
    y: Math.min(
      Math.max(0, initialPosition.y),
      window.innerHeight - constrainedInitialSize.height - 48
    ),
  };

  const [position, setPosition] = useState(constrainedInitialPosition);
  const [size, setSize] = useState(constrainedInitialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);

  // Handle opening animation end
  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        onOpeningAnimationEnd?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpening, onOpeningAnimationEnd]);

  // Handle window click for focus
  const handleWindowClick = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  // Calculate header background based on focus state
  const getHeaderBackground = useCallback(() => {
    if (isActive === undefined) {
      // Default behavior when isActive is not provided
      return currentTheme.glass.backgroundDark;
    }

    if (isActive) {
      // Focused window - use current darker background
      return currentTheme.glass.backgroundDark;
    } else {
      // Unfocused window - use lighter background
      return theme === 'dark'
        ? 'rgba(60, 60, 60, 0.95)' // Lighter gray for dark theme
        : 'rgba(240, 240, 240, 0.95)'; // Lighter gray for light theme
    }
  }, [isActive, currentTheme.glass.backgroundDark, theme]);

  // Maximized window
  if (isMaximized) {
    return (
      <>
        {/* Animation Styles for Maximized Window */}
        <style jsx>{`
          @keyframes windowOpen {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes windowClose {
            from {
              transform: scale(1);
              opacity: 1;
            }
            to {
              transform: scale(0.9);
              opacity: 0;
            }
          }

          .animate-window-open {
            animation: windowOpen 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)
              forwards;
          }

          .animate-window-close {
            animation: windowClose 0.3s cubic-bezier(0.32, 0, 0.67, 0) forwards;
          }
        `}</style>
        <div
          className={`fixed inset-0 z-50 shadow-2xl maximized-window transition-all duration-300 ease-out ${className} ${
            isOpening ? 'animate-window-open' : ''
          } ${isClosing ? 'animate-window-close' : ''}`}
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            bottom: '48px', // Leave space for taskbar
            transform: isOpening
              ? 'scale(0.9)'
              : isClosing
              ? 'scale(0.9)'
              : 'scale(1)',
            opacity: isOpening ? 0 : isClosing ? 0 : 1,
            ...style,
          }}
          onClick={handleWindowClick}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-2 select-none"
            style={{
              background: getHeaderBackground(),
              borderBottom: `1px solid ${currentTheme.glass.border}`,
              height: '40px',
            }}
          >
            <div
              className="text-sm font-medium truncate"
              style={{ color: currentTheme.text.primary }}
            >
              {title}
            </div>

            {/* Window Controls */}
            <div className="flex items-center space-x-1">
              {onMaximizeToggle && (
                <button
                  onClick={onMaximizeToggle}
                  className="p-1.5 rounded transition-all duration-150"
                  style={{ color: currentTheme.text.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      currentTheme.button.backgroundHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Minimize2 size={14} />
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded transition-all duration-150"
                  style={{ color: currentTheme.text.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e81123';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = currentTheme.text.primary;
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div
            className="overflow-auto custom-scrollbar"
            style={{
              height: 'calc(100% - 40px)',
              background: currentTheme.background,
            }}
          >
            {children}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Custom Scrollbar Styles and Window Animations */}
      <style jsx>{`
        @keyframes windowOpen {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes windowClose {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.8);
            opacity: 0;
          }
        }

        .animate-window-open {
          animation: windowOpen 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-window-close {
          animation: windowClose 0.3s cubic-bezier(0.32, 0, 0.67, 0) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.2)'};
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.35)'
            : 'rgba(0, 0, 0, 0.35)'};
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(0, 0, 0, 0.5)'};
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)'};
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)'};
        }
      `}</style>

      <Rnd
        bounds="body"
        cancel=".not-draggable, .window-content"
        onDragStart={() => {
          setIsDragging(true);
          onFocus?.();
        }}
        onDragStop={(e, d) => {
          setIsDragging(false);

          // Ensure window doesn't go offscreen when moved
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Calculate new size if window extends beyond screen edges
          const adjustedSize = { ...size };
          if (d.x + size.width > viewportWidth - 20) {
            adjustedSize.width = Math.max(300, viewportWidth - d.x - 20);
          }
          if (d.y + size.height > viewportHeight - 68) {
            adjustedSize.height = Math.max(200, viewportHeight - d.y - 68);
          }

          // Update size if changes were needed
          if (
            adjustedSize.width !== size.width ||
            adjustedSize.height !== size.height
          ) {
            setSize(adjustedSize);
            onSizeChange?.(adjustedSize);
          }

          // Update position
          const newPosition = { x: d.x, y: d.y };
          setPosition(newPosition);
          onPositionChange?.(newPosition);
        }}
        onResize={(e, direction, ref, delta, pos) => {
          setIsResizing(true);

          // Constrain size to viewport
          const newSize = {
            width: Math.min(ref.offsetWidth, window.innerWidth - 40),
            height: Math.min(ref.offsetHeight, window.innerHeight - 88),
          };

          // Constrain position to keep window within viewport
          const newPosition = {
            x: Math.min(Math.max(0, pos.x), window.innerWidth - newSize.width),
            y: Math.min(
              Math.max(0, pos.y),
              window.innerHeight - newSize.height - 48
            ),
          };

          setSize(newSize);
          setPosition(newPosition);
          onSizeChange?.(newSize);
          onPositionChange?.(newPosition);
        }}
        onResizeStop={() => {
          setIsResizing(false);
        }}
        size={size}
        position={position}
        minWidth={300}
        minHeight={300}
        className={`${
          isDragging || isResizing ? '' : 'transition-all duration-200 ease-out'
        } ${className}`}
        style={{
          zIndex: isDragging || isResizing ? 999 : style?.zIndex || 50,
          cursor: 'default',
          ...style,
        }}
        resizeHandleStyles={handleStyles}
        onClick={handleWindowClick}
      >
        <div
          ref={windowRef}
          className={`h-full shadow-2xl transition-all duration-300 ease-out ${
            isOpening ? 'animate-window-open' : ''
          } ${isClosing ? 'animate-window-close' : ''}`}
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transform: isOpening
              ? 'scale(0.8)'
              : isClosing
              ? 'scale(0.8)'
              : 'scale(1)',
            opacity: isOpening ? 0 : isClosing ? 0 : 1,
          }}
        >
          {/* Header - Draggable */}
          <div
            className="flex items-center justify-between px-4 py-2 cursor-move select-none"
            style={{
              background: getHeaderBackground(),
              borderBottom: `1px solid ${currentTheme.glass.border}`,
              height: '40px',
            }}
          >
            <div
              className="text-sm font-medium truncate pointer-events-none"
              style={{ color: currentTheme.text.primary }}
            >
              {title}
            </div>

            {/* Window Controls */}
            <div className="not-draggable flex items-center space-x-1 pointer-events-auto">
              {onMaximizeToggle && (
                <button
                  onClick={onMaximizeToggle}
                  className="p-1.5 rounded transition-all duration-150"
                  style={{ color: currentTheme.text.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      currentTheme.button.backgroundHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Maximize2 size={14} />
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded transition-all duration-150"
                  style={{ color: currentTheme.text.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e81123';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = currentTheme.text.primary;
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div
            className="window-content relative overflow-auto custom-scrollbar"
            style={{
              height: 'calc(100% - 40px)',
              background: currentTheme.background,
            }}
          >
            {children}
          </div>
        </div>
      </Rnd>
    </>
  );
};

export default AppOutline;
