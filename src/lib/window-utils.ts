import { WindowState } from '@/components/webpage/window-manager';

export const handleAppClick = (
  appId: string,
  windows: WindowState[],
  focusWindow: (id: string) => void,
  minimizeWindow: (id: string) => void,
  openAppById: (id: string) => void,
  focusAndRestoreWindow?: (id: string) => void
) => {
  const openWindow = windows.find((window) => window.id === appId);

  if (openWindow) {
    if (openWindow.isMinimized) {
      if (focusAndRestoreWindow) {
        focusAndRestoreWindow(openWindow.id);
      } else {
        minimizeWindow(openWindow.id);
      }
    } else if (!openWindow.isActive) {
      focusWindow(openWindow.id);
    }
  } else {
    openAppById(appId);
  }
};
