'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SteamTheme } from '@/components/types/system-types';

// Define navigation history types
type NavigationState = {
  id: string;
  data?: Record<string, unknown>;
};

type NavigationContextType = {
  history: NavigationState[];
  currentIndex: number;
  navigate: (id: string, data?: Record<string, unknown>) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  getCurrentState: () => NavigationState | null;
};

// Create context for navigation history
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Provider component for navigation history
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<NavigationState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const navigate = useCallback(
    (id: string, data?: Record<string, unknown>) => {
      // Remove forward history when navigating to a new state
      const newHistory = history.slice(0, currentIndex + 1);
      const newState: NavigationState = { id, data };

      setHistory([...newHistory, newState]);
      setCurrentIndex(newHistory.length);
    },
    [history, currentIndex]
  );

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (canGoBack) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [canGoBack, currentIndex]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [canGoForward, currentIndex]);

  const getCurrentState = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < history.length) {
      return history[currentIndex];
    }
    return null;
  }, [history, currentIndex]);

  const value = {
    history,
    currentIndex,
    navigate,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    getCurrentState,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook to use navigation history
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// ChevronButton component
interface ChevronButtonProps {
  direction: 'back' | 'forward';
  steamTheme: SteamTheme;
  className?: string;
  color?: string;
}

export const ChevronButton: React.FC<ChevronButtonProps> = ({
  direction,
  steamTheme,
  className = '',
  color,
}) => {
  const { canGoBack, canGoForward, goBack, goForward } = useNavigation();

  const handleClick = () => {
    if (direction === 'back' && canGoBack) {
      goBack();
    } else if (direction === 'forward' && canGoForward) {
      goForward();
    }
  };

  const isDisabled =
    (direction === 'back' && !canGoBack) ||
    (direction === 'forward' && !canGoForward);

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`w-8 h-8 flex items-center justify-center rounded-full hover:cursor-pointer ${
        isDisabled ? 'opacity-50' : 'hover:brightness-125'
      } ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        color: color || steamTheme.textSecondary,
      }}
    >
      {direction === 'back' ? (
        <ChevronLeft size={16} />
      ) : (
        <ChevronRight size={16} />
      )}
    </button>
  );
};

// Component that uses the navigation system
interface NavigationConsumerProps {
  id: string;
  onNavigate?: (state: NavigationState | null) => void;
  children?: ReactNode;
}

export const NavigationConsumer: React.FC<NavigationConsumerProps> = ({
  id,
  onNavigate,
  children,
}) => {
  const { navigate, getCurrentState, history, currentIndex } = useNavigation();

  // Handle initial navigation and history changes
  useEffect(() => {
    const currentState = getCurrentState();

    // If there's no current state yet, navigate to this component
    if (!currentState) {
      navigate(id);
    } else if (onNavigate) {
      onNavigate(currentState);
    }
  }, [id, navigate, getCurrentState, onNavigate, history, currentIndex]);

  return <>{children}</>;
};

export default ChevronButton;
