export interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  iconLight?: string;
  description: string;
}

export const desktopApps: DesktopApp[] = [
  {
    id: 'text-editor',
    name: 'Notepad',
    icon: '/app icons/textlight.svg',
    iconLight: '/app icons/text.svg',
    description: 'Text Editor',
  },

  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.svg',
    description: 'Gaming Platform',
  },
  {
    id: 'about-me',
    name: 'About Me',
    icon: '/app icons/slack.png',
    description: 'About Me',
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
