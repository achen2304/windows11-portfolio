export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'copy';
  timestamp: Date;
  data?: Record<string, unknown>; // For storing additional data like copied text
  fromToast?: boolean; // Flag to indicate if this notification came from a toast
}

export interface NotificationStore {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Simple in-memory store - in a real app, this would be persisted
let notificationStore: Notification[] = [];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const notificationUtils = {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const now = new Date();
    const recentDuplicate = notificationStore.find((n) => {
      return (
        n.title === notification.title &&
        n.type === notification.type &&
        now.getTime() - n.timestamp.getTime() < 300000
      ); // 5 minutes
    });

    if (recentDuplicate) {
      if (notification.fromToast) {
        recentDuplicate.fromToast = true;
      }
      return recentDuplicate.id;
    }

    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: now,
    };

    notificationStore.unshift(newNotification);

    if (notificationStore.length > 10) {
      notificationStore = notificationStore.slice(0, 10);
    }

    notifyListeners();
    return id;
  },

  getNotifications: () => [...notificationStore],

  removeNotification: (id: string) => {
    notificationStore = notificationStore.filter((n) => n.id !== id);
    notifyListeners();
  },

  clearAll: () => {
    notificationStore = [];
    notifyListeners();
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

interface ToastData {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  notification?: boolean;
}

export const copyToClipboard = async (
  text: string,
  title: string = 'Copied!',
  addToast: (toast: ToastData) => void
) => {
  try {
    await navigator.clipboard.writeText(text);

    addToast({
      title: title,
      description: `${text} copied to clipboard`,
      type: 'success',
      duration: 4000,
      notification: true,
    });

    return true;
  } catch {
    addToast({
      title: 'Copy failed',
      description: 'Unable to copy to clipboard',
      type: 'error',
      duration: 4000,
    });

    return false;
  }
};
