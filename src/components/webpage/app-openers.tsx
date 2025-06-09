'use client';

import React from 'react';
import { useWindow } from './window-manager';
import SteamApp from './primary/steam/steam-app';
import TextEditorApp from './primary/text/text-editor-app';
import SlackApp from './primary/slack/slack';

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

// Define all available apps in one place
export const availableApps: AppDefinition[] = [
  {
    id: 'text-editor',
    name: 'Notepad',
    icon: '/app icons/text.svg',
    component: <TextEditorApp />,
    defaultSize: { width: 400, height: 350 },
    defaultPosition: { x: 500, y: 300 },
    category: 'Productivity',
    description: 'Windows 11 style Notepad for text editing',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '/app icons/steam.svg',
    component: <SteamApp />,
    defaultSize: { width: 1200, height: 800 },
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
  // Add more apps here easily:
  // {
  //   id: 'browser',
  //   name: 'Web Browser',
  //   icon: '🌐',
  //   component: <BrowserApp />,
  //   defaultSize: { width: 1000, height: 700 },
  //   category: 'Internet',
  //   description: 'Browse the web',
  // },
];

// Hook for opening apps
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

    // Generate unique window ID to allow multiple instances
    const windowId = `${app.id}-${Date.now()}`;

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

// Individual app opener functions for easy use
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
    // Add more specific openers here as needed
  };
};

export default useAppOpener;
