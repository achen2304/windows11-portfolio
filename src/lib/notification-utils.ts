export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'copy';
  timestamp: Date;
  data?: Record<string, unknown>; // For storing additional data like copied text
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
  // Add a notification with duplicate prevention
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    // Check for duplicates based on title and type within the last 5 minutes
    const now = new Date();
    const recentDuplicate = notificationStore.find(
      (n) =>
        n.title === notification.title &&
        n.type === notification.type &&
        now.getTime() - n.timestamp.getTime() < 300000 // 5 minutes
    );

    if (recentDuplicate) {
      return recentDuplicate.id; // Return existing ID instead of creating duplicate
    }

    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: now,
    };

    notificationStore.unshift(newNotification); // Add to beginning

    // Keep only last 50 notifications
    if (notificationStore.length > 10) {
      notificationStore = notificationStore.slice(0, 10);
    }

    notifyListeners();
    return id;
  },

  // Get all notifications
  getNotifications: () => [...notificationStore],

  // Remove notification
  removeNotification: (id: string) => {
    notificationStore = notificationStore.filter((n) => n.id !== id);
    notifyListeners();
  },

  // Clear all notifications
  clearAll: () => {
    notificationStore = [];
    notifyListeners();
  },

  // Subscribe to changes
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
}

// Copy utility that creates both toast and notification
export const copyToClipboard = async (
  text: string,
  title: string = 'Copied!',
  addToast: (toast: ToastData) => void
) => {
  try {
    await navigator.clipboard.writeText(text);

    // Add toast
    addToast({
      title,
      description: `${text} copied to clipboard`,
      type: 'success',
      duration: 4000,
    });

    // Add persistent notification
    notificationUtils.addNotification({
      title,
      description: `${text} copied to clipboard`,
      type: 'copy',
      data: { copiedText: text },
    });

    return true;
  } catch {
    // Add error toast
    addToast({
      title: 'Copy failed',
      description: 'Unable to copy to clipboard',
      type: 'error',
      duration: 4000,
    });

    // Add error notification
    notificationUtils.addNotification({
      title: 'Copy failed',
      description: 'Unable to copy to clipboard',
      type: 'error',
    });

    return false;
  }
};
