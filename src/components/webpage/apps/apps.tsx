export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  iconLight?: string;
  description?: string;
  onDesktop?: boolean;
  onTaskbar?: boolean;
  onStartPanel?: boolean;
  isPinned?: boolean;
}

export interface QuickLink {
  id: string;
  name: string;
  newTab?: boolean;
  type?: 'link' | 'copy';
  url?: string;
  icon?: string;
  iconLight?: string;
}

export const allApps: AppDefinition[] = [
  {
    id: 'text-editor',
    name: '.txt',
    icon: '/app icons/textlight.svg',
    iconLight: '/app icons/textdark.svg',
    description: 'Text Editor',
    onDesktop: true,
    onTaskbar: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'about-me',
    name: 'About',
    icon: '/app icons/slack.webp',
    description: 'About Me',
    onDesktop: true,
    onTaskbar: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.webp',
    description: 'Gaming Platform',
    onDesktop: true,
    onTaskbar: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'word',
    name: 'Resume',
    icon: '/app icons/word.svg',
    description: 'Resume',
    onDesktop: true,
    onTaskbar: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'contact-me',
    name: 'Contact',
    icon: '/app icons/outlook.svg',
    description: 'Outlook-inspired email client',
    onDesktop: true,
    onTaskbar: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/app icons/chatgptlight.webp',
    iconLight: '/app icons/chatgpt.webp',
    description: 'ChatGPT AI Assistant',
    onDesktop: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '/app icons/spotify.png',
    description: 'Spotify Music Player',
    onDesktop: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'comments',
    name: 'Comments',
    icon: '/app icons/twitter.webp',
    description: 'Portfolio Comments',
    onDesktop: true,
    onStartPanel: true,
    isPinned: true,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    icon: '/app icons/vscode.svg',
    description: 'VS Code-inspired portfolio repository',
    onDesktop: true,
    onStartPanel: true,
    isPinned: false,
  },
  {
    id: 'google',
    name: 'Google',
    icon: '/app icons/google.svg',
    description: 'Google Search',
    onDesktop: true,
    onStartPanel: true,
    isPinned: false,
  },
];

// Filtered app getters for backward compatibility
export const desktopApps = allApps.filter((app) => app.onDesktop);
export const taskbarApps = allApps.filter((app) => app.onTaskbar);
export const startPanelApps = allApps.filter((app) => app.onStartPanel);

// Quick links configuration
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
    url: 'mailto:cai@czchen.dev',
  },
];

// For backward compatibility
export const quickLinks: QuickLink[] = getQuickLinks('dark');
