'use client';

import React, { useState, useCallback, createContext, useContext } from 'react';
import AppOutline from './outline';

export interface WindowState {
  id: string;
  title: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  isActive: boolean;
  isOpening?: boolean;
  isClosing?: boolean;
}

interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (window: Omit<WindowState, 'zIndex' | 'isActive'>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number }
  ) => void;
  finishOpeningAnimation: (id: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(
  null
);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      'useWindowManager must be used within a WindowManagerProvider'
    );
  }
  return context;
};

interface WindowManagerProviderProps {
  children: React.ReactNode;
}

export const WindowManagerProvider: React.FC<WindowManagerProviderProps> = ({
  children,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  // Calculate staggered position for new windows
  const getStaggeredPosition = useCallback((index: number) => {
    const offset = index * 30;
    return {
      x: 100 + offset,
      y: 100 + offset,
    };
  }, []);

  const openWindow = useCallback(
    (windowData: Omit<WindowState, 'zIndex' | 'isActive'>) => {
      setWindows((prev) => {
        // Check if window already exists
        const existingWindow = prev.find((w) => w.id === windowData.id);
        if (existingWindow) {
          // Focus existing window instead of creating new one
          const highestZIndex = Math.max(50, ...prev.map((w) => w.zIndex));
          const newZIndex = Math.max(highestZIndex + 1, nextZIndex);
          return prev.map((w) => ({
            ...w,
            isActive: w.id === windowData.id,
            zIndex: w.id === windowData.id ? newZIndex : w.zIndex,
          }));
        }

        // Create new window with staggered position
        const position =
          windowData.position || getStaggeredPosition(prev.length);

        // Get highest z-index currently in use, ensure new window is on top
        const highestZIndex =
          prev.length > 0 ? Math.max(50, ...prev.map((w) => w.zIndex)) : 50;
        const newZIndex = Math.max(highestZIndex + 1, nextZIndex);

        const newWindow: WindowState = {
          ...windowData,
          position,
          zIndex: newZIndex,
          isActive: true,
          isOpening: true,
          isClosing: false,
        };

        // Deactivate all other windows
        const updatedWindows = prev.map((w) => ({ ...w, isActive: false }));

        setNextZIndex((prev) => Math.min(newZIndex + 1, 999));
        return [...updatedWindows, newWindow];
      });
    },
    [nextZIndex, getStaggeredPosition]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isClosing: true } : w))
    );

    // Remove window after animation completes
    setTimeout(() => {
      setWindows((prev) => prev.filter((w) => w.id !== id));
    }, 300);
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const targetWindow = prev.find((w) => w.id === id);
        if (!targetWindow || targetWindow.isMinimized) return prev;

        // Get highest z-index currently in use, ensure new zIndex is higher
        const highestZIndex = Math.max(50, ...prev.map((w) => w.zIndex));
        const newZIndex = Math.max(highestZIndex + 1, nextZIndex);

        const updatedWindows = prev.map((w) => ({
          ...w,
          isActive: w.id === id,
          zIndex: w.id === id ? newZIndex : w.zIndex,
        }));

        setNextZIndex((prev) => Math.min(newZIndex + 1, 999));
        return updatedWindows;
      });
    },
    [nextZIndex]
  );

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized, isActive: false } : w
      )
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const updateWindowPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  const updateWindowSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
    },
    []
  );

  const finishOpeningAnimation = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpening: false } : w))
    );
  }, []);

  const contextValue: WindowManagerContextType = {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
    finishOpeningAnimation,
  };

  return (
    <WindowManagerContext.Provider value={contextValue}>
      {children}

      {/* Render all windows */}
      {windows.map(
        (window) =>
          !window.isMinimized && (
            <AppOutline
              key={window.id}
              title={window.title}
              initialPosition={window.position}
              initialSize={window.size}
              isMaximized={window.isMaximized}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximizeToggle={() => maximizeWindow(window.id)}
              isActive={window.isActive}
              isOpening={window.isOpening}
              isClosing={window.isClosing}
              onOpeningAnimationEnd={() => finishOpeningAnimation(window.id)}
              style={{
                zIndex: window.zIndex,
                transition:
                  !window.isOpening && !window.isClosing
                    ? 'opacity 0.2s ease, box-shadow 0.2s ease'
                    : 'none',
              }}
              onFocus={() => focusWindow(window.id)}
              onPositionChange={(position) =>
                updateWindowPosition(window.id, position)
              }
              onSizeChange={(size) => updateWindowSize(window.id, size)}
            >
              {window.component}
            </AppOutline>
          )
      )}
    </WindowManagerContext.Provider>
  );
};

// Hook for easy window operations
export const useWindow = () => {
  const { openWindow, closeWindow } = useWindowManager();

  const createWindow = useCallback(
    (
      id: string,
      title: string,
      component: React.ReactNode,
      options?: Partial<Pick<WindowState, 'position' | 'size' | 'isMaximized'>>
    ) => {
      openWindow({
        id,
        title,
        component,
        position: options?.position || { x: 100, y: 100 },
        size: options?.size || { width: 800, height: 600 },
        isMaximized: options?.isMaximized || false,
        isMinimized: false,
      });
    },
    [openWindow]
  );

  return { createWindow, closeWindow };
};
