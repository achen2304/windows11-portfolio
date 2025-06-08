export interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const desktopApps: DesktopApp[] = [
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.svg',
    description: 'Gaming Platform',
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: '/app icons/file.png',
    description: 'Text Editor',
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '/app icons/calculator.svg',
    description: 'Calculator',
  },
  {
    id: 'image-viewer',
    name: 'Photos',
    icon: '/app icons/file.png',
    description: 'Image Viewer',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '/app icons/terminal.png',
    description: 'System Settings',
  },
];
