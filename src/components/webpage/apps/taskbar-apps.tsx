import { TaskbarApp } from '@/components/taskbar/taskbar-types';

export const taskbarApps: TaskbarApp[] = [
  {
    id: 'text-editor',
    name: '.txt',
    icon: '/app icons/textlight.svg',
    iconLight: '/app icons/textdark.svg',
  },
  {
    id: 'contact-me',
    name: 'Contact',
    icon: '/app icons/outlook.svg',
  },
  {
    id: 'word',
    name: 'Resume',
    icon: '/app icons/word.svg',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.webp',
  },
  {
    id: 'about-me',
    name: 'About',
    icon: '/app icons/slack.webp',
  },
];
