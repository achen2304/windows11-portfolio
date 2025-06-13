import { WindowState } from '@/components/webpage/window-manager';

/**
 * Handles app click logic - focuses existing window or opens new one
 * @param appId - The ID of the app to handle
 * @param windows - Array of current windows
 * @param focusWindow - Function to focus a window
 * @param minimizeWindow - Function to minimize/restore a window
 * @param openAppById - Function to open a new app instance
 * @param focusAndRestoreWindow - Optional function to restore minimized windows
 */
export const handleAppClick = (
  appId: string,
  windows: WindowState[],
  focusWindow: (id: string) => void,
  minimizeWindow: (id: string) => void,
  openAppById: (id: string) => void,
  focusAndRestoreWindow?: (id: string) => void
) => {
  // Find window with the exact app ID (since we're using appId as windowId)
  const openWindow = windows.find((window) => window.id === appId);

  if (openWindow) {
    if (openWindow.isMinimized) {
      // If minimized, restore it using focusAndRestoreWindow if available
      if (focusAndRestoreWindow) {
        focusAndRestoreWindow(openWindow.id);
      } else {
        // Fall back to minimizeWindow which toggles the minimized state
        minimizeWindow(openWindow.id);
      }
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
