'use client';

import React from 'react';
import { Squares } from '@/components/ui/squares-background';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import TaskbarShell from '@/components/taskbar/taskbar-shell';
import { TaskbarApp } from '@/components/taskbar/taskbar-types';

export default function Home() {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  // Sample taskbar apps with enhanced data
  const taskbarApps: TaskbarApp[] = [
    {
      id: 'edge',
      name: 'Microsoft Edge',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Microsoft_Edge_logo_%282019%29.svg/64px-Microsoft_Edge_logo_%282019%29.svg.png',
      isActive: false,
      isPinned: true,
      hasNotification: false,
    },
    {
      id: 'code',
      name: 'Visual Studio Code',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/64px-Visual_Studio_Code_1.35_icon.svg.png',
      isActive: true,
      isPinned: true,
      hasNotification: false,
    },
    {
      id: 'folder',
      name: 'File Explorer',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Windows_Explorer_icon_%28Windows_10%29.svg/64px-Windows_Explorer_icon_%28Windows_10%29.svg.png',
      isActive: false,
      isPinned: true,
      hasNotification: false,
    },
    {
      id: 'terminal',
      name: 'Windows Terminal',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Windows_Terminal_Logo_256x256.png/64px-Windows_Terminal_Logo_256x256.png',
      isActive: false,
      isPinned: true,
      hasNotification: false,
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Discord_logo.svg/64px-Discord_logo.svg.png',
      isActive: false,
      isPinned: true,
      hasNotification: true, // Example of a notification
    },
    {
      id: 'spotify',
      name: 'Spotify',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/64px-Spotify_icon.svg.png',
      isActive: false,
      isPinned: true,
      hasNotification: false,
    },
  ];

  const handleAppClick = (appId: string) => {
    console.log(`App clicked: ${appId}`);

    // Example of handling different app clicks
    switch (appId) {
      case 'edge':
        console.log('Opening Microsoft Edge...');
        break;
      case 'code':
        console.log('Opening Visual Studio Code...');
        break;
      case 'folder':
        console.log('Opening File Explorer...');
        break;
      case 'terminal':
        console.log('Opening Windows Terminal...');
        break;
      case 'discord':
        console.log('Opening Discord...');
        break;
      case 'spotify':
        console.log('Opening Spotify...');
        break;
      default:
        console.log(`Opening ${appId}...`);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: currentTheme.background }}
    >
      {/* Animated Squares Background covering entire viewport */}
      <div className="fixed inset-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          squareSize={30}
          borderColor={currentTheme.squares.border}
          hoverFillColor={currentTheme.squares.hoverFill}
          backgroundColor={currentTheme.squares.background}
          className="w-full h-full"
        />
        <div
          className="absolute inset-0"
          style={{ background: currentTheme.gradient.radial }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen pb-12">
        {/* Portfolio Content */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <h1
              className="text-6xl font-bold mb-6"
              style={{ color: currentTheme.text.primary }}
            >
              Welcome to My Portfolio
            </h1>
            <p
              className="text-xl mb-8"
              style={{ color: currentTheme.text.secondary }}
            >
              Windows 11-inspired design with modern aesthetics
            </p>

            {/* Feature showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div
                className="p-6 rounded-lg backdrop-blur-sm"
                style={{
                  background: currentTheme.glass.background,
                  border: `1px solid ${currentTheme.glass.border}`,
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: currentTheme.text.primary }}
                >
                  Modern Taskbar
                </h3>
                <p
                  className="text-sm"
                  style={{ color: currentTheme.text.secondary }}
                >
                  Windows 11-inspired taskbar with Start menu, system tray, and
                  calendar
                </p>
              </div>

              <div
                className="p-6 rounded-lg backdrop-blur-sm"
                style={{
                  background: currentTheme.glass.background,
                  border: `1px solid ${currentTheme.glass.border}`,
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: currentTheme.text.primary }}
                >
                  Interactive Panels
                </h3>
                <p
                  className="text-sm"
                  style={{ color: currentTheme.text.secondary }}
                >
                  System settings, calendar events, and notification management
                </p>
              </div>

              <div
                className="p-6 rounded-lg backdrop-blur-sm"
                style={{
                  background: currentTheme.glass.background,
                  border: `1px solid ${currentTheme.glass.border}`,
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: currentTheme.text.primary }}
                >
                  Theme System
                </h3>
                <p
                  className="text-sm"
                  style={{ color: currentTheme.text.secondary }}
                >
                  Dynamic dark/light theme switching with consistent styling
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p
                className="text-sm opacity-75"
                style={{ color: currentTheme.text.muted }}
              >
                Try clicking on the taskbar elements below to explore the
                interface
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Windows Taskbar Shell - All panels managed here */}
      <TaskbarShell apps={taskbarApps} onAppClick={handleAppClick} />
    </div>
  );
}
