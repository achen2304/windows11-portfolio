'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { X, Maximize2, Minimize2, Minus } from 'lucide-react';


interface AppOutlineProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  onClose?: () => void;
  className?: string;
  isMaximized?: boolean;
  onMaximizeToggle?: () => void;
  onMinimize?: () => void;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  isActive?: boolean;
  isOpening?: boolean;
  isClosing?: boolean;
  onOpeningAnimationEnd?: () => void;
  isMinimizing?: boolean;
  isReopening?: boolean;
}

const AppOutline: React.FC<AppOutlineProps> = ({
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 800, height: 600 },
  minWidth = 300,
  minHeight = 300,
  onClose,
  className = '',
  isMaximized = false,
  onMaximizeToggle,
  onMinimize,
  style,
  onFocus,
  onPositionChange,
  onSizeChange,
  isActive,
  isOpening = false,
  isClosing = false,
  onOpeningAnimationEnd,
  isMinimizing = false,
  isReopening = false,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  const constrainedInitialSize = {
    width: Math.max(
      minWidth,
      Math.min(initialSize.width, window.innerWidth - 40)
    ),
    height: Math.max(
      minHeight,
      Math.min(initialSize.height, window.innerHeight - 88)
    ),
  };

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
  const dragRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Handle dragging (mouse and touch)
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragRef.current?.contains(e.target as Node)) return;

    setIsDragging(true);
    onFocus?.();
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Handle both mouse and touch events
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault(); // Prevent scrolling on touch devices

      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newX = currentX - offsetX;
      const newY = currentY - offsetY;

      // Keep window within viewport bounds
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height - 48; // Account for taskbar

      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      };

      setPosition(newPosition);
      onPositionChange?.(newPosition);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      // Remove both mouse and touch event listeners
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };

    // Add both mouse and touch event listeners
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  }, [size, onFocus, onPositionChange]);

  // Handle resizing (mouse and touch)
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!resizeRef.current?.contains(e.target as Node)) return;

    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);

    // Handle both mouse and touch events
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newWidth = Math.max(minWidth, startWidth + (currentX - startX));
      const newHeight = Math.max(minHeight, startHeight + (currentY - startY));

      // Keep window within viewport bounds
      const maxWidth = window.innerWidth - position.x;
      const maxHeight = window.innerHeight - position.y - 48;

      const newSize = {
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newHeight, maxHeight)
      };

      setSize(newSize);
      onSizeChange?.(newSize);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      // Remove both mouse and touch event listeners
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('touchend', handleResizeEnd);
    };

    // Add both mouse and touch event listeners
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchmove', handleResizeMove, { passive: false });
    document.addEventListener('touchend', handleResizeEnd);
  }, [size, position, minWidth, minHeight, onSizeChange]);

  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        onOpeningAnimationEnd?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpening, onOpeningAnimationEnd]);

  const handleWindowClick = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const getHeaderBackground = useCallback(() => {
    if (isActive === undefined) {
      return currentTheme.glass.backgroundDark;
    }

    if (isActive) {
      return currentTheme.glass.backgroundDark;
    } else {
      return theme === 'dark'
        ? 'rgba(60, 60, 60, 0.95)'
        : 'rgba(240, 240, 240, 0.95)';
    }
  }, [isActive, currentTheme.glass.backgroundDark, theme]);

  if (isMaximized) {
    return (
      <>
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

          @keyframes windowMinimize {
            from {
              transform: scale(1);
              opacity: 1;
            }
            to {
              transform: scale(0.6) translateY(80vh);
              opacity: 0;
            }
          }

          @keyframes windowReopen {
            from {
              transform: scale(0.6) translateY(80vh);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-window-open {
            animation: windowOpen 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          }

          .animate-window-close {
            animation: windowClose 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)
              forwards;
          }

          .animate-window-minimize {
            animation: windowMinimize 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)
              forwards;
          }

          .animate-window-reopen {
            animation: windowReopen 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)
              forwards;
          }
        `}</style>
        <div
          className={`fixed inset-0 z-50 shadow-2xl maximized-window transition-all duration-300 ease-out ${className} ${
            isOpening && !isClosing && !isMinimizing
              ? 'animate-window-open'
              : ''
          } ${
            isClosing && !isOpening && !isMinimizing
              ? 'animate-window-close'
              : ''
          } ${isMinimizing ? 'animate-window-minimize' : ''} ${
            isReopening ? 'animate-window-reopen' : ''
          }`}
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            bottom: '48px',
            transform:
              isOpening && !isReopening
                ? 'scale(0.9)'
                : isClosing
                ? 'scale(0.9)'
                : isMinimizing
                ? 'scale(0.6) translateY(80vh)'
                : isReopening
                ? 'scale(0.6) translateY(80vh)'
                : 'scale(1)',
            opacity:
              isOpening || isMinimizing || isReopening ? 0 : isClosing ? 0 : 1,
            ...style,
          }}
          onClick={handleWindowClick}
        >
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

            <div className="flex items-center space-x-1">
              {onMinimize && (
                <button
                  onClick={onMinimize}
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
                  <Minus size={14} />
                </button>
              )}

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

        @keyframes windowMinimize {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.6) translateY(80vh);
            opacity: 0;
          }
        }

        @keyframes windowReopen {
          from {
            transform: scale(0.6) translateY(80vh);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-window-open {
          animation: windowOpen 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }

        .animate-window-close {
          animation: windowClose 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }

        .animate-window-minimize {
          animation: windowMinimize 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)
            forwards;
        }

        .animate-window-reopen {
          animation: windowReopen 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
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

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)'};
        }
      `}</style>

      <div
        className={`fixed ${
          isDragging || isResizing ? '' : 'transition-all duration-200 ease-out'
        } ${className}`}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          zIndex: isDragging || isResizing ? 999 : style?.zIndex || 50,
          cursor: isDragging ? 'grabbing' : isResizing ? 'nw-resize' : 'default',
          ...style,
        }}
        onClick={handleWindowClick}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div
          ref={windowRef}
          className={`h-full shadow-2xl transition-all duration-300 ease-out ${
            isOpening && !isClosing && !isMinimizing
              ? 'animate-window-open'
              : ''
          } ${
            isClosing && !isOpening && !isMinimizing
              ? 'animate-window-close'
              : ''
          } ${isMinimizing ? 'animate-window-minimize' : ''} ${
            isReopening ? 'animate-window-reopen' : ''
          }`}
          style={{
            background: currentTheme.glass.background,
            border: `1px solid ${currentTheme.glass.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transform:
              isOpening && !isReopening
                ? 'scale(0.8)'
                : isClosing
                ? 'scale(0.8)'
                : isMinimizing
                ? 'scale(0.6) translateY(80vh)'
                : isReopening
                ? 'scale(0.6) translateY(80vh)'
                : 'scale(1)',
            opacity:
              isOpening || isMinimizing || isReopening ? 0 : isClosing ? 0 : 1,
          }}
        >
          <div
            ref={dragRef}
            className="flex items-center justify-between px-4 py-2 cursor-grab active:cursor-grabbing select-none"
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

            <div className="not-draggable flex items-center space-x-1 pointer-events-auto">
              {onMinimize && (
                <button
                  onClick={onMinimize}
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
                  <Minus size={14} />
                </button>
              )}

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

          <div
            className="window-content relative overflow-auto custom-scrollbar"
            style={{
              height: 'calc(100% - 40px)',
              background: currentTheme.background,
            }}
          >
            {children}
          </div>

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize"
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            style={{
              background:
                'linear-gradient(-45deg, transparent 0%, transparent 30%, currentColor 30%, currentColor 35%, transparent 35%, transparent 65%, currentColor 65%, currentColor 70%, transparent 70%)',
              color: theme === 'dark' ? 'rgb(156 163 175)' : 'rgb(107 114 128)',
            }}
            title="Drag to resize"
          />
        </div>
      </div>
    </>
  );
};

export default AppOutline;
