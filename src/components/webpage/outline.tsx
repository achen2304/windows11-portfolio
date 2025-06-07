'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface AppOutlineProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
  isMaximized?: boolean;
  onMaximizeToggle?: () => void;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  isActive?: boolean;
}

const AppOutline: React.FC<AppOutlineProps> = ({
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 800, height: 600 },
  onClose,
  onMinimize,
  className = '',
  isMaximized = false,
  onMaximizeToggle,
  style,
  onFocus,
  onPositionChange,
  onSizeChange,
  isActive,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  // Custom drag implementation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;

      requestAnimationFrame(() => {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };
        setPosition(newPosition);
        onPositionChange?.(newPosition);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset, isMaximized, onPositionChange]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;

      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      onFocus?.(); // Focus window when starting to drag
      e.preventDefault();
    },
    [isMaximized, onFocus]
  );

  // Memoized resize callback
  const handleResize = useCallback(
    (e: any, data: any) => {
      const newSize = { width: data.size.width, height: data.size.height };
      setSize(newSize);
      onSizeChange?.(newSize);
    },
    [onSizeChange]
  );

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

  if (isMaximized) {
    return (
      <div
        className={`fixed inset-0 z-50 shadow-2xl maximized-window ${className}`}
        style={{
          background: currentTheme.glass.background,
          border: `1px solid ${currentTheme.glass.border}`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          bottom: '48px', // Leave space for taskbar
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
    );
  }

  return (
    <div
      ref={windowRef}
      className={`fixed z-50 ${className}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default',
        ...style,
      }}
      onClick={handleWindowClick}
    >
      {/* Custom styles for react-resizable */}
      <style jsx>{`
        .react-resizable-handle-se {
          background: transparent !important;
          border: none !important;
          width: 16px !important;
          height: 16px !important;
          bottom: 0px !important;
          right: 0px !important;
        }
        .react-resizable-handle-se::after {
          display: none !important;
        }

        /* Custom Scrollbar Styles */
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

      <ResizableBox
        width={size.width}
        height={size.height}
        onResize={handleResize}
        minConstraints={[300, 200]}
        resizeHandles={['se']}
      >
        <div
          className={`h-full shadow-2xl transition-shadow duration-200 ${className}`}
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
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
            onMouseDown={handleMouseDown}
          >
            <div
              className="text-sm font-medium truncate pointer-events-none"
              style={{ color: currentTheme.text.primary }}
            >
              {title}
            </div>

            {/* Window Controls */}
            <div className="flex items-center space-x-1 pointer-events-auto">
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
            className="relative overflow-auto custom-scrollbar"
            style={{
              height: 'calc(100% - 40px)',
              background: currentTheme.background,
            }}
          >
            {children}

            {/* Custom Resize Handle with Three Lines */}
            <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none">
              <div className="absolute bottom-1 right-1 space-y-0.5">
                <div
                  className="w-3 h-0.5 transform rotate-45 origin-bottom-right opacity-60"
                  style={{
                    background: currentTheme.text.muted,
                    marginBottom: '1px',
                  }}
                />
                <div
                  className="w-2.5 h-0.5 transform rotate-45 origin-bottom-right opacity-60"
                  style={{
                    background: currentTheme.text.muted,
                    marginBottom: '1px',
                  }}
                />
                <div
                  className="w-2 h-0.5 transform rotate-45 origin-bottom-right opacity-60"
                  style={{
                    background: currentTheme.text.muted,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default AppOutline;
