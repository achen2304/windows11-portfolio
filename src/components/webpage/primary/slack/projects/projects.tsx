import React from 'react';
import Message from '../message';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import WelcomeBanner from '../common/WelcomeBanner';
import { useAppOpener, availableApps } from '@/components/webpage/app-openers';
import { useWindowManager } from '@/components/webpage/window-manager';

const Portfolio: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;
  const { openAppById } = useAppOpener();
  const { windows, focusAndRestoreWindow, focusWindow, openWindow } = useWindowManager();

  // Create clickable Projects content
  const projectsContent = (
    <span>
      To see all of my projects, please visit my{' '}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const openWindow = windows.find((window) => window.id === 'projects');
          
          if (openWindow) {
              focusAndRestoreWindow('projects');

          } else {
            const projectsApp = availableApps.find(app => app.id === 'projects');
            if (projectsApp) {
              openAppById('projects');
              
            }
          }
        }}
        className="font-bold hover:underline cursor-pointer transition-colors"
        style={{ color: slackTheme.accent }}
      >
        Projects
      </button>{' '}
      app.  
    </span>
  );

  return (
    <div className="p-4">
      {/* Channel welcome message */}
      <WelcomeBanner
        title="My Projects"
        description="This channel provides a location to open my projects."
        slackTheme={slackTheme}
      />

      {/* Projects messages */}
      <div className="space-y-4 mb-6">
        <Message
          content={projectsContent}
          user="Cai Chen"
          timestamp="10:22 AM"
          avatar="/other/profile.webp"
        />
      </div>
    </div>
  );
};

export default Portfolio;
