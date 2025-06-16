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
    icon: '/app icons/slack.webp',
    description: 'About Me',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.webp',
    description: 'Gaming Platform',
  },
  {
    id: 'word',
    name: 'Resume',
    icon: '/app icons/word.svg',
    description: 'Resume',
  },
  {
    id: 'contact-me',
    name: 'Contact',
    icon: '/app icons/outlook.svg',
    description: 'Outlook-inspired email client',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/app icons/chatgptlight.webp',
    iconLight: '/app icons/chatgpt.webp',
    description: 'ChatGPT AI Assistant',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '/app icons/spotify.png',
    description: 'Spotify Music Player',
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
