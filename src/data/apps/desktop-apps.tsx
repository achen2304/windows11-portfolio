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
    icon: '/app icons/steam.webp',
    description: 'Gaming Platform',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    icon: '/app icons/vscode.svg',
    description: 'VS Code-inspired portfolio repository',
  },
  {
    id: 'google',
    name: 'Google',
    icon: '/app icons/google.svg',
    description: 'Google Search',
  },
];
