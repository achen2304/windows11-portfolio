import { StartApp, QuickLink } from '@/components/taskbar/taskbar-types';

export const startPanelApps: StartApp[] = [
  {
    id: 'text-editor',
    name: 'Notepad',
    icon: '/app icons/textlight.svg',
    description: 'Text Editor',
    isPinned: true,
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.svg',
    description: 'Gaming Platform',
    isPinned: true,
  },
  {
    id: 'about-me',
    name: 'About Me',
    icon: '/app icons/slack.png',
    description: 'About Me Information',
    isPinned: true,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '/app icons/calculator.svg',
    description: 'Calculator',
    isPinned: true,
  },
  {
    id: 'image-viewer',
    name: 'Photos',
    icon: '/app icons/file.png',
    description: 'Image Viewer',
    isPinned: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '/app icons/terminal.png',
    description: 'System Settings',
    isPinned: true,
  },
];

export const getQuickLinks = (theme: string): QuickLink[] => [
  {
    id: 'link1',
    name: 'LinkedIn',
    newTab: true,
    type: 'link',
    icon: '/app icons/linkedin.svg',
    url: 'https://www.linkedin.com/in/achen2304/',
  },
  {
    id: 'link2',
    name: 'Github',
    newTab: true,
    type: 'link',
    icon:
      theme === 'dark'
        ? '/app icons/githubdark.svg'
        : '/app icons/githublight.svg',
    url: 'https://github.com/achen2304',
  },
  {
    id: 'link3',
    name: 'Resume',
    newTab: true,
    type: 'link',
    icon: '/app icons/file.png',
    url: '/resume.pdf',
  },
  {
    id: 'link4',
    name: 'Email',
    newTab: true,
    type: 'copy',
    icon: '/app icons/gmail.svg',
    url: 'mailto:achen2304@gmail.com',
  },
];

// For backward compatibility
export const quickLinks: QuickLink[] = getQuickLinks('dark');
