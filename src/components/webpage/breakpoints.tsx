'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Size breakpoints similar to Windows UI
export type WindowSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface UseWindowSizeOptions {
  // Default breakpoints, can be overridden
  breakpoints?: {
    xs: number; // Extra small
    sm: number; // Small
    md: number; // Medium
    lg: number; // Large
    xl: number; // Extra large
  };
}

export interface WindowSizeContextType {
  width: number;
  height: number;
  size: WindowSize;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
}

// Default breakpoints in pixels
const DEFAULT_BREAKPOINTS = {
  xs: 400, // Extra small windows
  sm: 550, // Small windows
  md: 800, // Medium windows
  lg: 1000, // Large windows
  xl: 1200, // Extra large windows
};

// Create context for window size
const WindowSizeContext = React.createContext<
  WindowSizeContextType | undefined
>(undefined);

// Hook to use window size within components
export const useWindowSize = (): WindowSizeContextType => {
  const context = React.useContext(WindowSizeContext);
  if (!context) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider');
  }
  return context;
};

export interface WindowSizeProviderProps {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  options?: UseWindowSizeOptions;
}

// Provider component
export const WindowSizeProvider: React.FC<WindowSizeProviderProps> = ({
  children,
  containerRef,
  options = {},
}) => {
  const breakpoints = {
    ...DEFAULT_BREAKPOINTS,
    ...(options.breakpoints || {}),
  };

  // Initialize with default values
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    size: WindowSize;
  }>({
    width: 0,
    height: 0,
    size: 'md',
  });

  // Use refs to store previous values to compare and avoid unnecessary updates
  const prevDimensionsRef = useRef({ width: 0, height: 0 });

  // Memoize breakpoints to avoid recreation on every render
  const breakpointsRef = useRef(breakpoints);

  // Determine window size category based on width
  const getWindowSize = useCallback(
    (width: number): WindowSize => {
      const { xs, sm, md, lg } = breakpointsRef.current;
      if (width < xs) return 'xs';
      if (width < sm) return 'sm';
      if (width < md) return 'md';
      if (width < lg) return 'lg';
      return 'xl';
    },
    [] // No dependencies needed as we're using breakpointsRef
  );

  // Update dimensions when container size changes
  const updateDimensions = useCallback(() => {
    if (containerRef?.current) {
      // Get dimensions from the container ref
      const { offsetWidth, offsetHeight } = containerRef.current;

      // Only update if dimensions have actually changed
      if (
        prevDimensionsRef.current.width !== offsetWidth ||
        prevDimensionsRef.current.height !== offsetHeight
      ) {
        const size = getWindowSize(offsetWidth);

        // Update our ref with current values
        prevDimensionsRef.current = {
          width: offsetWidth,
          height: offsetHeight,
        };

        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
          size,
        });
      }
    } else if (typeof window !== 'undefined') {
      // Fallback to window dimensions if no container ref
      const { innerWidth, innerHeight } = window;

      // Only update if dimensions have actually changed
      if (
        prevDimensionsRef.current.width !== innerWidth ||
        prevDimensionsRef.current.height !== innerHeight
      ) {
        const size = getWindowSize(innerWidth);

        // Update our ref with current values
        prevDimensionsRef.current = {
          width: innerWidth,
          height: innerHeight,
        };

        setDimensions({
          width: innerWidth,
          height: innerHeight,
          size,
        });
      }
    }
  }, [containerRef, getWindowSize]); // Minimal dependencies

  // Update breakpoints ref if options change
  useEffect(() => {
    breakpointsRef.current = {
      ...DEFAULT_BREAKPOINTS,
      ...(options.breakpoints || {}),
    };
  }, [options.breakpoints]);

  // Setup resize observer and event listeners
  useEffect(() => {
    // Initial update
    updateDimensions();

    if (containerRef?.current) {
      // Use ResizeObserver for container element
      const observer = new ResizeObserver(() => {
        // Use requestAnimationFrame to throttle updates
        window.requestAnimationFrame(updateDimensions);
      });

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
      };
    } else if (typeof window !== 'undefined') {
      // Use window resize event as fallback
      const handleResize = () => {
        // Use requestAnimationFrame to throttle updates
        window.requestAnimationFrame(updateDimensions);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [containerRef, updateDimensions]);

  // Create context value with helper booleans
  const contextValue: WindowSizeContextType = {
    width: dimensions.width,
    height: dimensions.height,
    size: dimensions.size,
    isXs: dimensions.size === 'xs',
    isSm: dimensions.size === 'sm',
    isMd: dimensions.size === 'md',
    isLg: dimensions.size === 'lg',
    isXl: dimensions.size === 'xl',
  };

  return (
    <WindowSizeContext.Provider value={contextValue}>
      {children}
    </WindowSizeContext.Provider>
  );
};

// Helper component for conditional rendering based on window size
interface WindowSizeRendererProps {
  children: React.ReactNode;
  sizes: WindowSize[];
}

export const WindowSizeRenderer: React.FC<WindowSizeRendererProps> = ({
  children,
  sizes,
}) => {
  const { size } = useWindowSize();
  return <>{sizes.includes(size) ? children : null}</>;
};

export default WindowSizeProvider;
