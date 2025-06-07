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
  const [nextZIndex, setNextZIndex] = useState(50);

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
          const newZIndex = Math.min(nextZIndex, 99);
          return prev.map((w) => ({
            ...w,
            isActive: w.id === windowData.id,
            zIndex: w.id === windowData.id ? newZIndex : w.zIndex,
          }));
        }

        // Create new window with staggered position
        const position =
          windowData.position || getStaggeredPosition(prev.length);
        const newZIndex = Math.min(nextZIndex, 99);
        const newWindow: WindowState = {
          ...windowData,
          position,
          zIndex: newZIndex,
          isActive: true,
        };

        // Deactivate all other windows
        const updatedWindows = prev.map((w) => ({ ...w, isActive: false }));

        setNextZIndex((prev) => Math.min(prev + 1, 99));
        return [...updatedWindows, newWindow];
      });
    },
    [nextZIndex, getStaggeredPosition]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const targetWindow = prev.find((w) => w.id === id);
        if (!targetWindow || targetWindow.isMinimized) return prev;

        const newZIndex = Math.min(nextZIndex, 99);
        const updatedWindows = prev.map((w) => ({
          ...w,
          isActive: w.id === id,
          zIndex: w.id === id ? newZIndex : w.zIndex,
        }));

        setNextZIndex((prev) => Math.min(prev + 1, 99));
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

  const contextValue: WindowManagerContextType = {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
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
              style={{
                zIndex: window.zIndex,
                transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
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
