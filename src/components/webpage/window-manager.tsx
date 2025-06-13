'use client';

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  useRef,
  useEffect,
} from 'react';
import AppOutline from './outline';
import { ErrorBoundary } from './error-boundary';
import { availableApps } from './app-openers';

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
  isMinimizing?: boolean;
  isReopening?: boolean;
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
  focusAndRestoreWindow: (id: string) => void;
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

// Type for stored window state
interface StoredWindowState {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
  isMinimized: boolean;
  appId: string; // Store the app ID to recreate the component
}

export const WindowManagerProvider: React.FC<WindowManagerProviderProps> = ({
  children,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  // Define maximum number of windows
  const MAX_WINDOWS = 8;

  // Load windows from localStorage on mount
  useEffect(() => {
    try {
      const storedWindows = localStorage.getItem('windowStates');
      if (storedWindows) {
        const parsedWindows: StoredWindowState[] = JSON.parse(storedWindows);

        // Recreate windows from stored state
        parsedWindows.forEach((storedWindow) => {
          // Find the app definition to get the component
          const appId = storedWindow.appId;
          // This assumes you have access to availableApps here
          // You might need to import it or pass it as a prop
          const appDefinition = availableApps.find((app) => app.id === appId);

          if (appDefinition) {
            openWindow({
              id: storedWindow.id,
              title: storedWindow.title,
              component: appDefinition.component,
              position: storedWindow.position,
              size: storedWindow.size,
              isMaximized: storedWindow.isMaximized,
              isMinimized: storedWindow.isMinimized,
            });
          }
        });
      }
    } catch (error) {
      console.error('Failed to restore window states:', error);
    }
  }, []);

  // Save windows to localStorage when they change
  useEffect(() => {
    if (windows.length > 0) {
      try {
        // Only store windows that aren't in the process of closing
        const storableWindows: StoredWindowState[] = windows
          .filter((window) => !window.isClosing) // Don't store closing windows
          .map((window) => {
            return {
              id: window.id,
              title: window.title,
              position: window.position,
              size: window.size,
              isMaximized: window.isMaximized,
              isMinimized: window.isMinimized,
              appId: window.id, // Since we're now using appId as the window.id directly
            };
          });

        localStorage.setItem('windowStates', JSON.stringify(storableWindows));
      } catch (error) {
        console.error('Failed to save window states:', error);
      }
    } else {
      // If there are no windows, clear the stored state
      localStorage.removeItem('windowStates');
    }
  }, [windows]);

  const getStaggeredPosition = useCallback((index: number) => {
    const offset = index * 30;
    return {
      x: 100 + offset,
      y: 100 + offset,
    };
  }, []);

  // Add a function to handle z-index cycling
  const getNextZIndex = useCallback(
    (currentHighest: number) => {
      // If z-index is getting too high, reset all windows to lower values
      // while maintaining their relative stacking order
      if (currentHighest > 600) {
        // Reset the base z-index
        setNextZIndex(100);

        // Sort windows by their current z-index
        const sortedWindows = [...windows].sort((a, b) => a.zIndex - b.zIndex);

        // Assign new z-indices starting from 50 with increments of 10
        setWindows((prevWindows) =>
          prevWindows.map((window) => {
            const index = sortedWindows.findIndex((w) => w.id === window.id);
            return {
              ...window,
              zIndex: 50 + index, // Maintain relative stacking order with lower values
            };
          })
        );

        // Return a reasonable next z-index
        return 100;
      }

      // Normal case - just increment
      return currentHighest + 1;
    },
    [windows]
  );

  const openWindow = useCallback(
    (windowData: Omit<WindowState, 'zIndex' | 'isActive'>) => {
      setWindows((windows) => {
        // Check if this window is already open
        const existingWindow = windows.find((w) => w.id === windowData.id);
        if (existingWindow) {
          const highestZIndex = Math.max(50, ...windows.map((w) => w.zIndex));
          const newZIndex = getNextZIndex(highestZIndex);
          return windows.map((w) => ({
            ...w,
            isActive: w.id === windowData.id,
            zIndex: w.id === windowData.id ? newZIndex : w.zIndex,
          }));
        }

        // Check if we've reached the maximum number of windows
        if (windows.length >= MAX_WINDOWS) {
          // Option 1: Prevent opening new window
          // return windows;

          // Option 2: Close the oldest window
          // Since we don't have timestamps anymore, just close the first window in the array
          const oldestWindow = windows[0];

          // Filter out the oldest window
          const updatedWindows = windows.filter(
            (w) => w.id !== oldestWindow.id
          );

          // Continue with adding the new window
          const position =
            windowData.position || getStaggeredPosition(updatedWindows.length);

          const highestZIndex =
            updatedWindows.length > 0
              ? Math.max(50, ...updatedWindows.map((w) => w.zIndex))
              : 50;
          const newZIndex = getNextZIndex(highestZIndex);

          const newWindow: WindowState = {
            ...windowData,
            position,
            zIndex: newZIndex,
            isActive: true,
            isOpening: true,
            isClosing: false,
          };

          const finalWindows = updatedWindows.map((w) => ({
            ...w,
            isActive: false,
          }));

          setNextZIndex(Math.min(newZIndex + 1, 999));
          return [...finalWindows, newWindow];
        }

        // Normal flow when under the limit
        const position =
          windowData.position || getStaggeredPosition(windows.length);

        const highestZIndex =
          windows.length > 0
            ? Math.max(50, ...windows.map((w) => w.zIndex))
            : 50;
        const newZIndex = getNextZIndex(highestZIndex);

        const newWindow: WindowState = {
          ...windowData,
          position,
          zIndex: newZIndex,
          isActive: true,
          isOpening: true,
          isClosing: false,
        };

        const updatedWindows = windows.map((w) => ({ ...w, isActive: false }));

        setNextZIndex(Math.min(newZIndex + 1, 999));
        return [...updatedWindows, newWindow];
      });
    },
    [nextZIndex, getStaggeredPosition, getNextZIndex]
  );

  // In window-manager.tsx
  const closeWindow = useCallback((id: string) => {
    // First mark the window as closing for animation
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isClosing: true } : w))
    );

    // Create a timeout to actually remove the window after animation completes
    setTimeout(() => {
      setWindows((prev) => prev.filter((w) => w.id !== id));

      // Also remove from localStorage to prevent reappearing on refresh
      try {
        const storedWindows = localStorage.getItem('windowStates');
        if (storedWindows) {
          const parsedWindows: StoredWindowState[] = JSON.parse(storedWindows);
          const filteredWindows = parsedWindows.filter((w) => w.id !== id);
          localStorage.setItem('windowStates', JSON.stringify(filteredWindows));
        }
      } catch (error) {
        console.error('Failed to update stored window states:', error);
      }
    }, 300);
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((windows) => {
        const targetWindow = windows.find((w) => w.id === id);
        if (!targetWindow || targetWindow.isMinimized) return windows;

        const highestZIndex = Math.max(50, ...windows.map((w) => w.zIndex));
        const newZIndex = getNextZIndex(highestZIndex);

        const updatedWindows = windows.map((w) => ({
          ...w,
          isActive: w.id === id,
          zIndex: w.id === id ? newZIndex : w.zIndex,
        }));

        setNextZIndex(Math.min(newZIndex + 1, 999));
        return updatedWindows;
      });
    },
    [getNextZIndex]
  );

  const minimizeWindow = useCallback((id: string) => {
    // First mark the window as minimizing for animation
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimizing: true, isActive: false } : w
      )
    );

    // After animation completes, actually set it as minimized
    setTimeout(() => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isMinimized: true, isMinimizing: false } : w
        )
      );
    }, 300);
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
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isOpening: false,
              isReopening: false,
            }
          : w
      )
    );
  }, []);

  const focusAndRestoreWindow = useCallback(
    (id: string) => {
      setWindows((windows) => {
        const highestZIndex = Math.max(50, ...windows.map((w) => w.zIndex));
        const newZIndex = getNextZIndex(highestZIndex);

        // First mark the window as reopening and no longer minimized
        return windows.map((w) => ({
          ...w,
          isActive: w.id === id,
          isMinimized: w.id === id ? false : w.isMinimized,
          isReopening: w.id === id ? true : w.isReopening,
          zIndex: w.id === id ? newZIndex : w.zIndex,
        }));
      });

      // After animation completes, clear the reopening flag
      setTimeout(() => {
        setWindows((prev) =>
          prev.map((w) => (w.id === id ? { ...w, isReopening: false } : w))
        );
      }, 300);
    },
    [getNextZIndex]
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
    finishOpeningAnimation,
    focusAndRestoreWindow,
  };

  return (
    <WindowManagerContext.Provider value={contextValue}>
      {children}

      {windows.map(
        (window) =>
          !window.isMinimized && (
            <ErrorBoundary
              key={window.id}
              onError={(error) => {
                console.error(`Error in window ${window.id}:`, error);
                // Optionally close the problematic window after a delay
                setTimeout(() => closeWindow(window.id), 3000);
              }}
              fallback={
                <AppOutline
                  key={window.id}
                  title={`${window.title} (Error)`}
                  initialPosition={window.position}
                  initialSize={window.size}
                  isMaximized={window.isMaximized}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  isActive={window.isActive}
                  isMinimizing={window.isMinimizing}
                  isReopening={window.isReopening}
                  style={{ zIndex: window.zIndex }}
                >
                  <div className="p-4">
                    <p className="text-red-500">
                      This application encountered an error and needs to close.
                    </p>
                  </div>
                </AppOutline>
              }
            >
              <AppOutline
                key={window.id}
                title={window.title}
                initialPosition={window.position}
                initialSize={window.size}
                isMaximized={window.isMaximized}
                onClose={() => closeWindow(window.id)}
                onMaximizeToggle={() => maximizeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                isActive={window.isActive}
                isOpening={window.isOpening}
                isClosing={window.isClosing}
                isMinimizing={window.isMinimizing}
                isReopening={window.isReopening}
                onOpeningAnimationEnd={() => finishOpeningAnimation(window.id)}
                style={{
                  zIndex: window.zIndex,
                  transition:
                    !window.isOpening &&
                    !window.isClosing &&
                    !window.isMinimizing &&
                    !window.isReopening
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
            </ErrorBoundary>
          )
      )}
    </WindowManagerContext.Provider>
  );
};

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
