'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatedList } from '@/components/magicui/animated-list';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import { Check, Copy, X } from 'lucide-react';
import { ThemeObject } from '@/components/types/system-types';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after duration
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
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

function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[300] w-80">
      <AnimatedList delay={0}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
            theme={currentTheme as unknown as ThemeObject}
          />
        ))}
      </AnimatedList>
    </div>
  );
}

function ToastItem({
  toast,
  onClose,
  theme,
}: {
  toast: Toast;
  onClose: () => void;
  theme: ThemeObject;
}) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check size={16} className="text-green-500" />;
      case 'error':
        return <X size={16} className="text-red-500" />;
      case 'info':
      default:
        return <Copy size={16} style={{ color: theme.text?.muted }} />;
    }
  };

  return (
    <div
      className="flex items-start space-x-3 p-4 rounded-lg backdrop-blur-xl shadow-lg border"
      style={{
        background: theme.glass?.background,
        border: `1px solid ${theme.glass?.border}`,
        color: theme.text?.primary,
      }}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{toast.title}</div>
        {toast.description && (
          <div className="text-xs mt-1" style={{ color: theme.text?.muted }}>
            {toast.description}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-opacity-10 transition-colors"
        style={{ color: theme.text?.muted }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
