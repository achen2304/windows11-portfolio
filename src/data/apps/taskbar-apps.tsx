import { TaskbarApp } from '@/components/taskbar/taskbar-types';

export const taskbarApps: TaskbarApp[] = [
  {
    id: 'text-editor',
    name: 'Notepad',
    icon: '/app icons/textlight.svg',
    iconLight: '/app icons/textdark.svg',
  },
  {
    id: 'about-me',
    name: 'About Me',
    icon: '/app icons/slack.png',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.svg',
  },
];
