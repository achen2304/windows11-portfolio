import { StartApp, QuickLink } from '@/components/taskbar/taskbar-types';

export const startPanelApps: StartApp[] = [
  {
    id: 'text-editor',
    name: '.txt',
    icon: '/app icons/textlight.svg',
    iconLight: '/app icons/text.svg',
    description: 'Text Editor',
    isPinned: true,
  },
  {
    id: 'about-me',
    name: 'About',
    icon: '/app icons/slack.png',
    description: 'About Me Information',
    isPinned: true,
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.webp',
    description: 'Gaming Platform',
    isPinned: true,
  },
  {
    id: 'vscode',
    name: 'VSCode',
    icon: '/app icons/vscode.svg',
    isPinned: true,
  },
  {
    id: 'google',
    name: 'Google',
    icon: '/app icons/google.svg',
    isPinned: true,
  },
];

export const getQuickLinks = (theme: string): QuickLink[] => [
  {
    id: 'link1',
    name: 'LinkedIn',
    newTab: true,
    type: 'link',
    icon: '/app icons/quick links/linkedin.svg',
    url: 'https://www.linkedin.com/in/achen2304/',
  },
  {
    id: 'link2',
    name: 'Github',
    newTab: true,
    type: 'link',
    icon:
      theme === 'dark'
        ? '/app icons/quick links/githublight.svg'
        : '/app icons/quick links/githubdark.svg',

    iconLight: '/app icons/quick links/githubdark.svg',
    url: 'https://github.com/achen2304',
  },
  {
    id: 'link3',
    name: 'Email',
    newTab: true,
    type: 'copy',
    icon: '/app icons/quick links/gmail.svg',
    url: 'mailto:achen2304@gmail.com',
  },
];

// For backward compatibility
export const quickLinks: QuickLink[] = getQuickLinks('dark');
