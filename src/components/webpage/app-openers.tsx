'use client';

import React from 'react';
import { useWindow } from './window-manager';
import SteamApp from './primary/steam/steam-app';
import TextEditorApp from './primary/text/text-editor-app';
import SlackApp from './primary/slack/slack';
import VSCodeApp from './fun/vscode/vscode';
import GoogleApp from './fun/google/google';
import OutlookApp from './primary/outlook/outlook';
import WordApp from './primary/word/word';
import SpotifyApp from './fun/spotify/spotify-app';
import ChatGPTApp from './fun/chatgpt/chatgpt';
import TwitterApp from './fun/twitter/twitter';

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: React.ReactNode;
  defaultSize?: { width: number; height: number };
  defaultPosition?: { x: number; y: number };
  isMaximized?: boolean;
  category?: string;
  description?: string;
}

export const availableApps: AppDefinition[] = [
  {
    id: 'text-editor',
    name: 'Notepad',
    icon: '/app icons/text.svg',
    component: <TextEditorApp />,
    defaultSize: { width: 400, height: 375 },
    defaultPosition: { x: 500, y: 150 },
    category: 'Productivity',
    description: 'Windows 11 style Notepad for text editing',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.webp',
    component: <SteamApp />,
    defaultSize: { width: 1200, height: 800 },
    defaultPosition: { x: 200, y: 200 },
    category: 'Portfolio',
    description: 'Steam-inspired showcase of my development projects',
  },
  {
    id: 'about-me',
    name: 'About Me',
    icon: '/app icons/slack.svg',
    component: <SlackApp />,
    defaultSize: { width: 1000, height: 700 },
    category: 'Portfolio',
    description: 'Slack-inspired about me information and skills',
  },
  {
    id: 'contact-me',
    name: 'Contact Me',
    icon: '/app icons/outlook.svg',
    component: <OutlookApp />,
    defaultSize: { width: 400, height: 500 },
    defaultPosition: { x: 900, y: 200 },
    category: 'Communication',
    description: 'Outlook-inspired email client',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    icon: '/app icons/vscode.svg',
    component: <VSCodeApp />,
    defaultSize: { width: 1000, height: 700 },
    category: 'Portfolio',
    description: 'VS Code-inspired portfolio repository',
  },
  {
    id: 'google',
    name: 'Google',
    icon: '/app icons/google.svg',
    component: <GoogleApp />,
  },
  {
    id: 'word',
    name: 'Word',
    icon: '/app icons/word.svg',
    defaultSize: { width: 800, height: 800 },
    defaultPosition: { x: 1400, y: 1000 },
    component: <WordApp />,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '/app icons/spotify.png',
    component: <SpotifyApp />,
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 300, y: 400 },
    category: 'Entertainment',
    description: 'Spotify music player and library',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/app icons/chatgpt.webp',
    defaultSize: { width: 400, height: 500 },
    defaultPosition: { x: 1400, y: 200 },
    component: <ChatGPTApp />,
  },
  {
    id: 'comments',
    name: 'Comments',
    icon: '/app icons/twitter.webp',
    defaultSize: { width: 600, height: 500 },
    defaultPosition: { x: 1000, y: 300 },
    component: <TwitterApp />,
  },
];

export const useAppOpener = () => {
  const { createWindow } = useWindow();

  const openApp = (
    appId: string,
    options?: {
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      isMaximized?: boolean;
    }
  ) => {
    const app = availableApps.find((a) => a.id === appId);
    if (!app) {
      console.warn(`App with id "${appId}" not found`);
      return;
    }

    const windowId = appId;

    createWindow(windowId, app.name, app.component, {
      position: options?.position || app.defaultPosition,
      size: options?.size || app.defaultSize,
      isMaximized: options?.isMaximized || app.isMaximized || false,
    });
  };

  const openAppById = (appId: string) => openApp(appId);

  const getAppDefinition = (appId: string) => {
    return availableApps.find((a) => a.id === appId);
  };

  const getAllApps = () => availableApps;

  const getAppsByCategory = (category: string) => {
    return availableApps.filter((a) => a.category === category);
  };

  return {
    openApp,
    openAppById,
    getAppDefinition,
    getAllApps,
    getAppsByCategory,
    availableApps,
  };
};

export const useAppOpeners = () => {
  const { openApp } = useAppOpener();

  return {
    openTextEditor: (options?: Parameters<typeof openApp>[1]) =>
      openApp('text-editor', options),
    openSteam: (options?: Parameters<typeof openApp>[1]) =>
      openApp('steam', options),
    openNotepad: (options?: Parameters<typeof openApp>[1]) =>
      openApp('notepad', options),
    openCalculator: (options?: Parameters<typeof openApp>[1]) =>
      openApp('calculator', options),
    openImageViewer: (options?: Parameters<typeof openApp>[1]) =>
      openApp('image-viewer', options),
    openSettings: (options?: Parameters<typeof openApp>[1]) =>
      openApp('settings', options),
    openVSCode: (options?: Parameters<typeof openApp>[1]) =>
      openApp('vscode', options),
    openGoogle: (options?: Parameters<typeof openApp>[1]) =>
      openApp('google', options),
    openOutlook: (options?: Parameters<typeof openApp>[1]) =>
      openApp('outlook', options),
    openWord: (options?: Parameters<typeof openApp>[1]) =>
      openApp('word', options),
    openSpotify: (options?: Parameters<typeof openApp>[1]) =>
      openApp('spotify', options),
  };
};

export default useAppOpener;
