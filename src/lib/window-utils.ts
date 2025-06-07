import { Window } from '@/components/webpage/window-manager';

/**
 * Handles app click logic - focuses existing window or opens new one
 * @param appId - The ID of the app to handle
 * @param windows - Array of current windows
 * @param focusWindow - Function to focus a window
 * @param minimizeWindow - Function to minimize/restore a window
 * @param openAppById - Function to open a new app instance
 */
export const handleAppClick = (
  appId: string,
  windows: Window[],
  focusWindow: (id: string) => void,
  minimizeWindow: (id: string) => void,
  openAppById: (id: string) => void
) => {
  // Find window that starts with the app ID (to handle unique window IDs)
  const openWindow = windows.find((window) => window.id.startsWith(appId));

  if (openWindow) {
    if (openWindow.isMinimized) {
      // If minimized, restore it
      minimizeWindow(openWindow.id);
    } else if (!openWindow.isActive) {
      // If open but not active, focus it
      focusWindow(openWindow.id);
    }
    // If already active, do nothing (no minimize behavior)
  } else {
    // If not open, call the original openAppById to open it
    openAppById(appId);
  }
};
