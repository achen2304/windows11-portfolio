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
    name: '.txt',
    icon: '/app icons/textlight.svg',
    iconLight: '/app icons/textdark.svg',
    description: 'Text Editor',
  },
  {
    id: 'about-me',
    name: 'About',
    icon: '/app icons/slack.png',
    description: 'About Me',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.svg',
    description: 'Gaming Platform',
  },
];
