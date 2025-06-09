'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import {
  ChevronButton,
  NavigationProvider,
  useNavigation,
} from '@/components/webpage/chevron-button';
import Library from './all projects/library';
import FeaturedProjects from './feature projects/featured-projects';
import {
  WindowSizeProvider,
  useWindowSize,
} from '@/components/webpage/breakpoints';
import { SteamTheme } from '@/components/types/system-types';

// Inner component for Steam content with access to navigation and window size
const SteamContent: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const steamTheme = currentTheme.steam as SteamTheme;
  const { navigate, getCurrentState, history, currentIndex } = useNavigation();
  const { isXs, isSm, isMd } = useWindowSize();

  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');

  // Update tab when navigation state changes or initialize
  useEffect(() => {
    const currentState = getCurrentState();

    if (!currentState) {
      // Initialize with the featured tab
      navigate('steam-app', { tab: 'featured' });
    } else if (currentState.data?.tab) {
      // Update the active tab based on navigation
      setActiveTab(currentState.data.tab as 'featured' | 'all');
    }
  }, [history, currentIndex, navigate, getCurrentState]);

  // Handle tab change from UI
  const handleTabChange = (tab: 'featured' | 'all') => {
    if (activeTab !== tab) {
      // Preserve the current project selection when changing tabs
      const currentState = getCurrentState();
      const currentProject = currentState?.data?.project;

      setActiveTab(tab);
      navigate('steam-app', {
        tab,
        project: currentProject,
      });
    }
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: steamTheme.background }}
    >
      {/* Top navigation bar */}
      <div
        className="flex items-center p-2 border-b"
        style={{
          background: steamTheme.header,
          borderColor: steamTheme.divider,
        }}
      >
        <div className="flex items-center space-x-2 mr-4">
          <ChevronButton
            direction="back"
            steamTheme={steamTheme}
            color={steamTheme.textSecondary}
          />
          <ChevronButton
            direction="forward"
            steamTheme={steamTheme}
            color={steamTheme.textSecondary}
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleTabChange('featured')}
            className="uppercase font-medium text-sm px-2 py-1 transition-colors truncate hover:cursor-pointer"
            style={{
              color:
                activeTab === 'featured'
                  ? steamTheme.textPrimary
                  : steamTheme.textSecondary,
              borderBottom:
                activeTab === 'featured'
                  ? `2px solid ${steamTheme.highlight}`
                  : 'none',
            }}
          >
            {isXs ? 'FEATURED' : 'FEATURED PROJECTS'}
          </button>
          <button
            onClick={() => handleTabChange('all')}
            className="uppercase font-medium text-sm px-2 py-1 transition-colors truncate hover:cursor-pointer"
            style={{
              color:
                activeTab === 'all'
                  ? steamTheme.textPrimary
                  : steamTheme.textSecondary,
              borderBottom:
                activeTab === 'all'
                  ? `2px solid ${steamTheme.highlight}`
                  : 'none',
            }}
          >
            {isXs ? 'ALL' : 'ALL PROJECTS'}
          </button>
        </div>

        {/* Profile section - hidden on medium and smaller screens */}
        <div
          className="ml-auto flex items-center gap-2 px-3 py-1 rounded"
          style={{
            background: steamTheme.sidebarHover,
            display: isXs || isSm || isMd ? 'none' : 'flex',
          }}
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden">
            <Image
              src="/other/profile.webp"
              alt="Profile"
              fill
              sizes="28px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <span
            className="text-sm font-medium pl-1 pr-1"
            style={{ color: steamTheme.highlight }}
          >
            Cai Chen
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          {activeTab === 'all' && <Library />}
          {activeTab === 'featured' && <FeaturedProjects />}
        </div>
      </div>
    </div>
  );
};

// Inner component that uses navigation context
const SteamAppContent: React.FC = () => {
  // Create a ref for the content container
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="h-full flex flex-col">
      <WindowSizeProvider containerRef={contentRef}>
        <SteamContent />
      </WindowSizeProvider>
    </div>
  );
};

// Wrapper component that provides navigation context
const SteamApp: React.FC = () => {
  return (
    <NavigationProvider>
      <SteamAppContent />
    </NavigationProvider>
  );
};

export default SteamApp;
