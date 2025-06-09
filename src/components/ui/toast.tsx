'use client';

import { createContext, useContext, useCallback } from 'react';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import { Check, Copy, X } from 'lucide-react';
import { notificationUtils } from '@/lib/notification-utils';

export interface Toast {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  notification?: boolean;
}

interface ToastContextType {
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Define consistent icon size and styling
const iconSize = 18;
const iconStyle = { flexShrink: 0 };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  const removeToast = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  const addToast = useCallback(
    (toastProps: Toast) => {
      // Check if we should also add a notification (not set to false explicitly)
      if (toastProps.notification !== false) {
        // Add to notification system (with duplicate checking)
        notificationUtils.addNotification({
          title: toastProps.title,
          description: toastProps.description,
          type:
            toastProps.type === 'success'
              ? 'success'
              : toastProps.type === 'error'
              ? 'error'
              : 'info',
          fromToast: true,
        });
      }

      // Create a wrapper for the description with stronger color
      const descriptionEl = toastProps.description ? (
        <div
          style={{
            color: theme === 'light' ? '#4b5563' : '#cccccc',
            opacity: 1,
            fontWeight: 400,
          }}
        >
          {toastProps.description}
        </div>
      ) : undefined;

      // Always show the toast with Sonner
      const toastOptions = {
        duration: toastProps.duration || 3000,
        id: Math.random().toString(36).substr(2, 9),
        icon:
          toastProps.type === 'success' ? (
            <Check
              size={iconSize}
              className="text-green-500"
              style={iconStyle}
            />
          ) : toastProps.type === 'error' ? (
            <X size={iconSize} className="text-red-500" style={iconStyle} />
          ) : (
            <Copy
              size={iconSize}
              style={{ ...iconStyle, color: currentTheme.text?.muted }}
            />
          ),
        style: {
          background: currentTheme.glass?.background,
          border: `1px solid ${currentTheme.glass?.border}`,
          color: currentTheme.text?.primary,
        },
        className: 'backdrop-blur-xl shadow-lg',
      };

      // Use the appropriate Sonner toast type
      if (toastProps.type === 'success') {
        toast.success(toastProps.title, {
          description: descriptionEl,
          ...toastOptions,
        });
      } else if (toastProps.type === 'error') {
        toast.error(toastProps.title, {
          description: descriptionEl,
          ...toastOptions,
        });
      } else {
        toast.info(toastProps.title, {
          description: descriptionEl,
          ...toastOptions,
        });
      }
    },
    [currentTheme, theme]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
